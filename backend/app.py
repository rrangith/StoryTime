from flask import Flask, jsonify, request, abort, Response, stream_with_context
from flask_cors import CORS
from google.cloud import vision
import base64
import requests
import os
import pymongo
import string
import random
from stop_words import get_stop_words
import gridfs
import json

from secrets import azure_key, google_cloud_keyfile

stop_words = get_stop_words('en')

azure_subscription_key = azure_key
blacklist = ['pixelbay']

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = google_cloud_keyfile

bing_search_url = "https://api.cognitive.microsoft.com/bing/v7.0/images/search"

sentiment_url = "http://text-processing.com/api/sentiment/"

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './audio'
CORS(app)

client = vision.ImageAnnotatorClient()
# Names of likelihood from google.cloud.vision.enums
likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY')

mongo_client = pymongo.MongoClient('mongodb://localhost:27017/')
mongo = mongo_client['storytime']['sessions']
audio = gridfs.GridFS(mongo_client['audio'])


@app.route('/', methods=['GET'])
def get_page():
    return 'hi'


@app.route('/getImage', methods=['POST'])
def get_image():
    if not request.json or 'text' not in request.json:
        return abort(400)
    text = request.json['text']
    if not isinstance(text, str):
        return abort(400)

    score = 0

    if 'image' in request.json:
        image = request.json['image']

        if not isinstance(image, str):
            return abort(400)
        # strip the base64 image part from the string
        image = image.split(';base64,')[1]
        # convert the base64 into a bytes representation of the image
        image = base64.b64decode(image)
        # convert to google vision image
        image_google = vision.types.Image(content=image)

        response = client.face_detection(image=image_google)
        faces = response.face_annotations
        if len(faces) > 0:
            # Emotion options: joy, sorrow, anger, surprise
            face = faces[0]
            if face.sorrow_likelihood >= 4:
                score -= 1
            if face.joy_likelihood >= 4:
                score += 1

    text = [word for word in text.split() if word.lower() not in stop_words] #remove stop words
    text = ' '.join(text)

    response = requests.post(sentiment_url, data="text={}".format(text))
    if response.status_code == 200:
        sentiment_results = response.json()
        sentiment = sentiment_results['label']
        if sentiment == "pos":
            score += 1
        elif sentiment == "neg":
            score -= 1

    if score < 0:
        text += ' sad'
    elif score > 0:
        text += ' happy'

    bing_headers = {"Ocp-Apim-Subscription-Key": azure_subscription_key}
    bing_params = {"q": text, "license": "public", "imageType": "Photo"}
    response = requests.get(bing_search_url, headers=bing_headers, params=bing_params)
    search_results = response.json()

    if 'value' not in search_results:
        return 'Image not found'

    for i in range(len(search_results['value'])):
        image_url = search_results['value'][i]['contentUrl']
        if not any(banned in image_url for banned in blacklist):
            return image_url

    return 'Image not found'


@app.route('/save', methods=['POST'])
def save():
    if not request.form or 'data' not in request.form:
        return abort(400)

    if 'audio' not in request.files:
        return abort(400)

    file = request.files['audio']
    if file.filename == '':
        return abort(400)

    _id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
    data = request.form['data']
    data = json.loads(data)
    if not isinstance(data, list):
        abort(400)

    audio.put(file, _id=_id)
    mongo.insert_one({'_id': _id, 'data': data})
    return jsonify(id=_id)


@app.route('/story/<story>', methods=['GET'])
def watch(story):
    obj = mongo.find_one({'_id': story})
    if obj is None:
        return abort(400)
    return jsonify(data=obj['data'])


@app.route('/audio/<story>', methods=['GET'])
def listen(story):
    obj = mongo.find_one({'_id': story})
    if obj is None:
        return abort(400)

    def load():
        file = audio.find_one({'_id': story}).read()
        for i in range(0, len(file), 1024):
            yield file[i:len(file) if len(file) < i + 1024 else i + 1024]
    return Response(stream_with_context(load()), mimetype="audio/webm")


@app.route('/stories', methods=['GET'])
def get_recent_stories():
    stories = mongo.find()
    data = []
    for story in stories:
        if 'data' in story and len(story['data']) > 0:
            data.append({'id': story['_id'], 'thumbnail': story['data'][0]['image']})
    return jsonify(stories=data)


if __name__ == '__main__':
    # Run the flask server
    app.run(host='0.0.0.0', port=5000, debug=False)
