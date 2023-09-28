from flask import Blueprint, jsonify, request, abort, make_response
from app.models import User, Company, db
import random
import string
import jwt
from flask_bcrypt import Bcrypt
from app.utils import generate_code, create_jwt, decode_jwt

routes = Blueprint('routes', __name__)
bcrypt = Bcrypt()

@routes.route("/users")
def users():
    return {"message": "The Users is here"}

@routes.route("/users/register", methods=['POST'])
def registerUser():
    data = request.json  # Get JSON payload from the client
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    username = data.get('username', '')
    email = data.get('email', '')
    password = data.get('password', '')
    confirm_password = data.get('confirmPassword', '')
    hasDirectReports = data.get('hasDirectReports', '')
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
    if hasDirectReports:
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
    
    return jsonify({"message": "User successfully registered"}), 201

@routes.route("/users/login", methods=['POST'])
def loginUser():
    data = request.json  # Get JSON payload from the client
    username = data.get('username', '')
    password = data.get('password', '')

    #this checks if username and password exist
    user = User.query.filter_by(username=username).first()
    if not user:
        abort(400, description="Incorrect Login")

    isPasswordCorrect = bcrypt.check_password_hash(user.password_hash, password)
    if not isPasswordCorrect:
        abort(400, description="Incorrect Login")
    
    try:
        #creating jwt
        jwt_token = create_jwt(user.id, user.company_id, user.position_name, user.status)

        #create response object
        res = make_response(jsonify({"message": "User authenticated"}))

        #add jwt to cookie
        res.set_cookie('user_cookie', jwt_token, httponly=True, secure=True, samesite='Strict')
        return res, 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400
    
@routes.errorhandler(400)
def bad_request(error):
    return jsonify({'error': str(error.description)}), 400

def get_all_manager_codes():
    return [result[0] for result in db.session.query(User.manager_code).distinct().all()]