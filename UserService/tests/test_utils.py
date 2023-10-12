import pytest
import datetime
from app.utils import generate_code, create_jwt, decode_jwt
import jwt

class TestUtils:
    def test_generate_code(self):
        code = generate_code()
        assert len(code) == 6
        assert code.isalnum()

    def test_create_and_decode_jwt(self):
        user_id = 1
        company_id = 2
        position_name = 'Developer'
        status = 'Active'

        token = create_jwt(user_id, company_id, position_name, status)
        assert token is not None

        decoded_payload = decode_jwt(token)
        assert decoded_payload.get('user_id') == user_id
        assert decoded_payload.get('company_id') == company_id
        assert decoded_payload.get('position_name') == position_name
        assert decoded_payload.get('status') == status

    def test_decode_invalid_jwt(self):
        invalid_token = "invalid_token"
        assert decode_jwt(invalid_token) == "Invalid token"

    def test_decode_expired_jwt(self):
        user_id = 1
        company_id = 2
        position_name = 'Developer'
        status = 'Active'
        
        # Creating an expired JWT by setting the 'exp' to a past datetime
        exp_time = datetime.datetime.utcnow() - datetime.timedelta(seconds=1)
        
        # Encode the token with the expired time
        token = jwt.encode({'user_id': user_id, 'company_id': company_id, 
                            'position_name': position_name, 'status': status, 
                            'exp': exp_time}, 'we_need_to_change_this', algorithm='HS256')

        # Decode the token and check the result
        assert decode_jwt(token) == "Signature has expired"