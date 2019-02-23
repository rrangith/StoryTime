from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from PIL import Image
from google.cloud import vision
import base64
import requests
from io import BytesIO
import os
import json

from secrets import azure_key, google_cloud_keyfile

azure_subscription_key = azure_key

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = google_cloud_keyfile

bing_search_url = "https://api.cognitive.microsoft.com/bing/v7.0/images/search"

sentiment_url = "http://text-processing.com/api/sentiment/"

app = Flask(__name__)
CORS(app)

client = vision.ImageAnnotatorClient()
# Names of likelihood from google.cloud.vision.enums
likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY')

@app.route('/', methods=['GET'])
def index():
    return 'Welcome'


@app.route('/getImage', methods=['GET'])
def get_image():
    # TODO tone analysis???
    if not request.json or 'text' not in request.json:
        return abort(400)

    score = 0

    if 'image' in request.json:
        if not isinstance(image, str):
            return abort(400)
        image = request.json['image']
        # strip the base64 image part from the string
        image = image.split(';base64,')[1][:-1]
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

    text = request.json['text']
    if not isinstance(text, str):
        return abort(400)

    response = requests.post(sentiment_url, data="text={}".format(text))
    sentiment_results = response.json()
    sentiment = sentiment_results['label']
    if sentiment == "pos":
        score += 1
    elif sentiment == "neg":
        score -= 1

    if score < 0:
        search_term += ' sad'
    elif score > 0:
        search_term += ' happy'

    bing_headers = {"Ocp-Apim-Subscription-Key" : azure_subscription_key}
    bing_params  = {"q": search_term, "license": "public", "imageType": "Clipart"}
    response = requests.get(bing_search_url, headers=bing_headers, params=bing_params)
    search_results = response.json()
    image_url = search_results['value'][0]['contentUrl']

    return image_url

if __name__ == '__main__':
    # Run the flask server
    app.run(port=5000, debug=False)
