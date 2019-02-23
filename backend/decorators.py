from flask import abort, request
from functools import wraps
import pymongo
import time


mongo_client = pymongo.MongoClient('mongodb://localhost:27017/')
mongo = mongo_client['storytime']['sessions']
sample_token = {
    '_id': 'token_id',
    'open': False,
    'fileName': 'whatever.wav',
    'expiry': '1230123',
    'times': [
        # Approximate times in the .wav file to make image/text request
        1.2, 1.4, 1.9
    ]

}


def check_token(f):

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.json:
            if 'token' not in request.json:
                return abort(400)
            else:
                token = request.json['token']
        else:
            if 'token' not in request.args:
                return abort(400)
            else:
                token = request.args['token']

        token = mongo.find_one({'_id': token})
        if token is None:
            return abort(400)
        if token['expiry'] <= time.time():
            mongo.update_one({'_id': token}, {'$set': {'open': False}})
            return abort(400)
        return f(*args, **kwargs)

    return decorated_function


def get_token():
    if request.json:
        if 'token' not in request.json:
            return abort(400)
        else:
            token = request.json['token']
    else:
        if 'token' not in request.args:
            return abort(400)
        else:
            token = request.args['token']
    return mongo.find_one({'_id': token})
