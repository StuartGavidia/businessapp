"""
This module defines the different routes for the flask app
"""

import os
import json
import redis
from flask_bcrypt import Bcrypt
from flask import Blueprint, jsonify, request, abort, make_response
from app.models import User, Company, Role, CompanyFeature, Feature, Permission, UserPermission, db
from app.utils import generate_code, create_jwt, decode_jwt
from app.decorators import token_required

cache_host = os.environ.get('CACHE_HOST', 'caching-layer')
cache_port = int(os.environ.get('CACHE_PORT', 6379))
cache_db = int(os.environ.get('CACHE_DB', 0))

routes = Blueprint('routes', __name__)
bcrypt = Bcrypt()
cache = redis.Redis(host=cache_host, port=cache_port, db=cache_db)

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

    role_name = 'Manager' if has_direct_reports else 'Employee'
    role = Role.query.filter_by(name=role_name).first()
    new_user.roles.append(role)
    db.session.commit()

    #after succesfully registering user, clear the users from company cache
    cache_key = f"users_in_company_{company_id}"
    try:
        cache.delete(cache_key)
    except redis.RedisError as e:
        print(f"Unable to clear cache for {cache_key}: {e}")

    return jsonify({"message": "User successfully registered"}), 201

@routes.route("/users/get", methods=['GET'])
def get_user():
    """
    This route retrieves login information for a user
    """
    #Perform validation
    #check if user or email already in use
    username = request.args.get('username')
    current_user = User.query.filter_by(id=username).first()
    if current_user == None:
        abort(400, description="User does not exist")

    company = Company.query.filter_by(id=current_user.company_id).first()

    user_info = {
        'first_name':current_user.first_name,
        'last_name':current_user.last_name,
        'username':current_user.username,
        'email':current_user.email,
        'manager_code': current_user.manager_code,
        'position_name':current_user.position_name,
        'company_code':company.company_code,
    }

    return jsonify({"message": "User successfully retrieved",  "user_info": user_info}), 201

@routes.route("/users/update", methods=['POST'])
def update_user():
    """
    This route registers a user
    """
    data = request.json  # Get JSON payload from the client
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    user_name = data.get('username', '')
    email = data.get('email', '')
    manager_code = data.get('managerCode', '')
    company_code = data.get('companyCode', '')
    position_name = data.get('positionName', '')
    has_direct_reports = data.get('hasDirectReports', True)
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
    record_to_update = User.query.filter_by(username=user_name).first()
    record_to_update.first_name = first_name
    record_to_update.last_name = last_name
    record_to_update.email = email
    record_to_update.manager_code=current_manager_code
    record_to_update.manager_id=manager.id
    record_to_update.position_name=position_name
    record_to_update.company_id=company_id

    db.session.add(record_to_update)
    db.session.commit()

    return jsonify({"message": "User successfully updated"}), 201


@routes.route("/users/updatePassword", methods=['POST'])
def update_password():
    """
    This route registers a user
    """
    data = request.json  # Get JSON payload from the client
    user_name = data.get('username', '')
    password = data.get('password', '')
    #hash password to prepare for storage
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    record_to_update = User.query.filter_by(username=user_name).first()
    record_to_update.password_hash = hashed_password

    db.session.add(record_to_update)
    db.session.commit()

    return jsonify({"message": "User successfully updated"}), 201

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
def users_in_company():
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
    users_in_company = None # pylint: disable=redefined-outer-name
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
                'status': user.status,
                'manager_id': user.manager_id,
                'email': user.email,
                'picture': None
            } for user in users_in_company])

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
                'status': user.status,
                'manager_id': user.manager_id,
                'email': user.email,
                'picture': None
            } for user in users_in_company]
        except Exception as e: # pylint: disable=redefined-outer-name
            return jsonify({'message': 'Could not fetch users', 'error': str(e)}), 500

    if not users_data:
        abort(400, description="Incorrect Login")

    return users_data

@routes.route('/users/features', methods=['GET'])
@token_required
def get_user_features():
    token = request.cookies.get('user_cookie')
    payload = None

    try:
        payload = decode_jwt(token)
    except Exception:
        return jsonify({'message': 'Token is invalid!'}), 401

    user_id = payload['user_id']
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    company = Company.query.get(user.company_id)
    if not company:
        return jsonify({'error': 'Company not found'}), 404

    is_ceo = any(role.name == 'CEO' for role in user.roles)

    if is_ceo:
        features = Feature.query.filter(
          (Feature.industry_id == company.industry_id) | (Feature.industry_id.is_(None))
        ).all()
    else:
        features = Feature.query.join(CompanyFeature, Feature.id == CompanyFeature.feature_id)\
          .filter(CompanyFeature.company_id == user.company_id,
            CompanyFeature.enabled == True,
            Feature.name != 'Analytics',
            (Feature.industry_id == company.industry_id) | (Feature.industry_id.is_(None))).all()

    feature_list = [feature.name for feature in features]
    return jsonify(feature_list), 200

@routes.route('/users/permissions/check', methods=['GET'])
@token_required
def check_permissions():
    user_id = request.args.get('user_id')
    permission_name = request.args.get('permission_name')

    permission = Permission.query.join(UserPermission).filter(
        UserPermission.user_id == user_id,
        Permission.name == permission_name,
        UserPermission.granted.is_(True)
    ).first()
    if permission:
        return jsonify({'has_permission': True}), 200
    return jsonify({'has_permission': False}), 200

@routes.route('/users/update_member', methods=['POST'])
@token_required
def update_team_member():
    user_id = request.json.get('user_id')
    new_manager_id = request.json.get('new_manager_id')

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    new_manager = User.query.get(new_manager_id)
    if not new_manager or not new_manager.has_direct_reports:
        return jsonify({'error': 'New manager is not valid'}), 400

    user.manager_id = new_manager_id
    db.session.commit()
    return jsonify({'message': 'Team member moved successfully'}), 200

def is_in_management_chain(manager_id, employee_id):
    current_manager_id = User.query.get(employee_id).manager_id
    while current_manager_id:
        if current_manager_id == manager_id:
            return True
        current_manager_id = User.query.get(current_manager_id).manager_id
    return False

@routes.route('/users/permissionsAssign', methods=['POST'])
@token_required
def assign_permission():
    manager_id = request.json.get('manager_id')
    employee_id = request.json.get('employee_id')
    permission_id = request.json.get('permission_id')

    if not is_in_management_chain(manager_id, employee_id):
        return jsonify({'error': 'Unauthorized action'}), 403

    user_permission = UserPermission(user_id=employee_id, permission_id=permission_id, granted=True)
    db.session.add(user_permission)
    db.session.commit()
    return jsonify({'message': 'Permission assigned successfully'}), 200

@routes.route('/users/permissionsRevoke', methods=['POST'])
@token_required
def revoke_permission():
    manager_id = request.json.get('manager_id')
    employee_id = request.json.get('employee_id')
    permission_id = request.json.get('permission_id')

    if not is_in_management_chain(manager_id, employee_id):
        return jsonify({'error': 'Unauthorized action'}), 403

    user_permission = UserPermission.query.filter_by(user_id=employee_id, permission_id=permission_id).first()
    if user_permission:
        db.session.delete(user_permission)
        db.session.commit()
        return jsonify({'message': 'Permission revoked successfully'}), 200
    return jsonify({'error': 'Permission not found or already revoked'}), 404

@routes.route("/users/getById", methods=['GET'])
@token_required
def get_user_by_id():
    """
    This route retrieves login information for a user
    """
    token = request.cookies.get('user_cookie')
    payload = None

    try:
        payload = decode_jwt(token)
    except Exception:
        return jsonify({'message': 'Token is invalid!'}), 401

    user_id = payload['user_id']
    current_user = User.query.get(user_id)
    if not current_user:
        return jsonify({'error': 'User not found'}), 404

    user_info = {
        'id': current_user.id,
        'first_name': current_user.first_name,
        'last_name': current_user.last_name,
        'username': current_user.username,
        'email': current_user.email,
        'manager_id': current_user.manager_id,
        'position_name': current_user.position_name,
    }

    return jsonify(user_info), 201

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
