"""
This module contains custom function decorators
"""

from functools import wraps
from flask import request, jsonify
from app.utils import decode_jwt

def token_required(f):
    """
    Wrapper function
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        """
        Ensures that token passed in is valid
        """
        token = request.cookies.get('user_cookie')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            decode_jwt(token)
        except Exception:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(*args, **kwargs)
    return decorated