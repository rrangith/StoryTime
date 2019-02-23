from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from PIL import Image
import base64
import io

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def index():
    return 'Welcome'


@app.route('/getImage', methods=['GET'])
def get_image():
    # TODO tone analysis???
    if not request.json or 'text' not in request.json or 'image' not in request.json:
        return abort(400)

    text = request.json['text']
    image = request.json['image']
    if not isinstance(text, str) or not isinstance(image, str):
        return abort(400)

    # strip the base64 image part from the string
    image = image.split(';base64,')[1][:-1]
    # convert the base64 into a bytes representation of the image
    image = base64.b64decode(image)
    # convert the bytes into an image
    image = Image.open(io.BytesIO(image))
    # TODO process text and convert to image, facial analysis on image
    return 'Incomplete'


if __name__ == '__main__':
    # Run the flask server
    app.run(port=5000, debug=False)
