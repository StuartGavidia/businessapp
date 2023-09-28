import string
import random
import jwt

def generate_code(length=6):
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for i in range(length))

def create_jwt(user_id, company_id, position_name, status):
    payload = {
        'user_id': user_id,
        'company_id': company_id,
        'position_name': position_name,
        'status': status
    }
    secret = 'we_need_to_change_this'
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token

def decode_jwt(token):
    secret = 'we_need_to_change_this'
    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return "Signature has expired"
    except jwt.InvalidTokenError:
        return "Invalid token"