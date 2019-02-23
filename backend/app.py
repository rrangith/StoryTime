from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from PIL import Image
import base64
import io
import requests
from io import BytesIO

from secrets import azure_key

subscription_key = azure_key
bing_search_url = "https://api.cognitive.microsoft.com/bing/v7.0/images/search"

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def index():
    return 'Welcome'


@app.route('/getImage', methods=['GET'])
def get_image():
    # if not request.json or 'text' not in request.json:
    #     return abort(400)
    #
    # search_term = request.json['text']
    # if not isinstance(search_term, str):
    #     return abort(400)
    search_term = "cats"

    headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
    params  = {"q": search_term, "license": "public", "imageType": "Clipart"}

    response = requests.get(bing_search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()

    image_url = search_results['value'][0]['contentUrl']
    return image_url

if __name__ == '__main__':
    # Run the flask server
    app.run(port=5000, debug=False)
