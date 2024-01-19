"""
This module contains utility methods that are needed for the app functionality
"""

import string
import random
import datetime
import jwt

def generate_code(length=6):
    """
    Generate an arbitrary code of size length(default is 6)
    """
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for i in range(length))

def create_jwt(user_id, company_id, position_name, status, username, first_name, last_name):
    """
    Generate a jwt
    """
    payload = {
        'user_id': user_id,
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'company_id': company_id,
        'position_name': position_name,
        'status': status,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    secret = 'we_need_to_change_this'
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token

def decode_jwt(token):
    """
    Decode a jwt
    """
    secret = 'we_need_to_change_this'
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return "Signature has expired"
    except jwt.InvalidTokenError:
        return "Invalid token"
