"""
This module tests the utils.py class
"""

import datetime
import jwt
from app.utils import generate_code, create_jwt, decode_jwt

class TestUtils:
    """
    utils.py test class
    """
    def test_generate_code(self):
        """
        Assert that test generates code
        """
        code = generate_code()
        assert len(code) == 6
        assert code.isalnum()

    def test_create_and_decode_jwt(self):
        """
        Assert that jwt can be created and decoded
        """
        user_id = 1
        company_id = 2
        position_name = 'Developer'
        status = 'Active'
        username = 'pro'
        first_name = 'Person'
        last_name = 'Last'

        token = create_jwt(
            user_id, company_id, position_name, status, username, first_name, last_name
          )
        assert token is not None

        decoded_payload = decode_jwt(token)
        assert decoded_payload.get('user_id') == user_id
        assert decoded_payload.get('company_id') == company_id
        assert decoded_payload.get('position_name') == position_name
        assert decoded_payload.get('status') == status
        assert decoded_payload.get('username') == username
        assert decoded_payload.get('first_name') == first_name
        assert decoded_payload.get('last_name') == last_name

    def test_decode_invalid_jwt(self):
        """
        Assert that decode could recognize invalid token
        """
        invalid_token = "invalid_token"
        assert decode_jwt(invalid_token) == "Invalid token"

    def test_decode_expired_jwt(self):
        """
        Assert that decode could recognize invalid token
        """
        user_id = 1
        company_id = 2
        position_name = 'Developer'
        status = 'Active'
        username = 'pro'
        first_name = 'Person'
        last_name = 'Last'

        # Creating an expired JWT by setting the 'exp' to a past datetime
        exp_time = datetime.datetime.utcnow() - datetime.timedelta(seconds=1)

        # Encode the token with the expired time
        token = jwt.encode({'user_id': user_id, 'company_id': company_id,
                            'position_name': position_name, 'status': status,
                            'username': username, 'first_name': first_name, 'last_name': last_name,
                            'exp': exp_time}, 'we_need_to_change_this', algorithm='HS256')

        # Decode the token and check the result
        assert decode_jwt(token) == "Signature has expired"
