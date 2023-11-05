"""
This module defines the different routes for the flask app
"""

import os
from flask_bcrypt import Bcrypt
from flask import Blueprint, jsonify, request, abort, make_response
from app.models import User, Company, db
from app.utils import generate_code, create_jwt, decode_jwt
from app.decorators import token_required
import redis
import json

routes = Blueprint('routes', __name__)
bcrypt = Bcrypt()
cache = redis.Redis(host='caching-layer', port=6379, db=0)

@routes.route("/users")
def users():
    """Test route"""
    return {"message": "The Users is here"}

@routes.route("/users/register", methods=['POST'])
def register_user():
    """
    This route registers a user
    """
    data = request.json  # Get JSON payload from the client
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    username = data.get('username', '')
    email = data.get('email', '')
    password = data.get('password', '')
    has_direct_reports = data.get('hasDirectReports', '')
    manager_code = data.get('managerCode', '')
    company_code = data.get('companyCode', '')
    position_name = data.get('positionName', '')

    #Perform validation
    #check if user or email already in use
    if User.query.filter_by(username=username).first():
        abort(400, description="Username is already in use")
    elif User.query.filter_by(email=email).first():
        abort(400, description="Email is already in use")

    #check manager code is correct
    manager = User.query.filter_by(manager_code=manager_code).first()
    if manager_code == '' or (not manager):
        abort(400, description="Manager code does not exist")

    #check company code is correct
    company = Company.query.filter_by(company_code=company_code).first()
    if company_code == '' or (not company):
        abort(400, description="Company code does not exist")
    company_id = company.id

    current_manager_code = None
    if has_direct_reports:
        sample_code = generate_code()
        all_manager_codes = get_all_manager_codes()
        while sample_code in all_manager_codes:
            sample_code = generate_code()
        current_manager_code = sample_code

    #hash password to prepare for storage
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    #on Registration a user should be Active
    status = 'Active'

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password_hash=hashed_password,
        manager_code=current_manager_code,
        manager_id=manager.id,
        position_name=position_name,
        status=status,
        company_id=company_id
    )

    db.session.add(new_user)
    db.session.commit()

    #after succesfully registering user, clear the users from company cache
    cache_key = f"users_in_company_{company_id}"
    try:
        cache.delete(cache_key)
    except redis.RedisError as e:
        print(f"Unable to clear cache for {cache_key}: {e}")

    return jsonify({"message": "User successfully registered"}), 201

@routes.route("/users/login", methods=['POST'])
def login_user():
    """
    This route ensures that user provided the correct
    credentials and logs them in
    """
    data = request.json  # Get JSON payload from the client
    username = data.get('username', '')
    password = data.get('password', '')

    #this checks if username and password exist
    user = User.query.filter_by(username=username).first()
    if not user:
        abort(400, description="Incorrect Login")

    is_password_correct = bcrypt.check_password_hash(user.password_hash, password)
    if not is_password_correct:
        abort(400, description="Incorrect Login")

    try:
        #creating jwt
        jwt_token = create_jwt(
          user.id,
          user.company_id,
          user.position_name,
          user.status,
          user.username,
          user.first_name,
          user.last_name
        )

        #create response object
        res = make_response(jsonify({"userId": user.id}))

        env = os.environ.get('FLASK_ENV', 'development')
        if env == 'production':
            secure_flag = True
        elif env == 'testing':
            secure_flag = False
        else:
            secure_flag = False

        #add jwt to cookie
        res.set_cookie(
            'user_cookie', jwt_token, httponly=True, secure=secure_flag, samesite='Strict')
        return res, 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


@routes.route('/users/logout', methods=['POST'])
def logout():
    """
    This route clears jwt and logs user out
    """
    res = make_response(jsonify({"message": "Logged out"}))

    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'production':
        secure_flag = True
    elif env == 'testing':
        secure_flag = False
    else:
        secure_flag = False

    #set the cookie's expiration date to a past date, effectively removing it
    res.set_cookie(
        'user_cookie', '', expires=0, httponly=True, secure=secure_flag, samesite='Strict')

    return res, 200

@routes.route('/users/isLoggedIn', methods=['GET'])
@token_required
def is_logged_in():
    """This route checks if a user is logged in"""
    return jsonify({'status': 'authenticated'}), 200

@routes.route('/users/usersInCompany', methods=['GET'])
@token_required
def usersInCompany():
    """
    This route returns the users in the
    same company
    """
    token = request.cookies.get('user_cookie')
    payload = None

    try:
        payload = decode_jwt(token)
    except Exception:
        return jsonify({'message': 'Token is invalid!'}), 401

    company_id = payload['company_id']
    users_in_company = None
    redis_key = f"users_in_company_{payload['company_id']}"

    try:
        users_in_company_json = cache.get(redis_key)

        #cache miss
        if users_in_company_json is None:
            users_in_company = User.query.filter_by(company_id=company_id).all()

            users_in_company_json = json.dumps([{
                'user_id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'company_id': user.company_id,
                'position_name': user.position_name,
                'status': user.status
            } for user in users_in_company if int(user.id) != payload['user_id']])

            cache.set(redis_key, users_in_company_json, ex=120)

            users_data = json.loads(users_in_company_json)
        #cache hit
        else:
            users_data = json.loads(users_in_company_json)

    except redis.RedisError as e:
        print(f"Redis error occurred when accessing key: {redis_key} - {e}")

        try:
            users_in_company = User.query.filter_by(company_id=company_id).all()

            users_data = [{
                'user_id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'company_id': user.company_id,
                'position_name': user.position_name,
                'status': user.status
            } for user in users_in_company if int(user.id) != payload['user_id']]
        except Exception as e:
            return jsonify({'message': 'Could not fetch users from the database.', 'error': str(e)}), 500

    if not users_data:
        abort(400, description="Incorrect Login")

    return users_data

@routes.errorhandler(400)
def bad_request(error):
    """
    Error handler
    """
    return jsonify({'error': str(error.description)}), 400

def get_all_manager_codes():
    """
    Extracts all manager codes from user db
    """
    return [result[0] for result in db.session.query(User.manager_code).distinct().all()]
