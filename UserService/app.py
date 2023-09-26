from flask import Flask, request, jsonify, abort, make_response
from models import User, Company, db
import os
import random
import string
import jwt
from flask_bcrypt import Bcrypt

app = Flask(__name__)

# Read database configuration from environment variables
db_host = os.environ.get('DATABASE_HOST', 'localhost')
db_port = os.environ.get('DATABASE_PORT', '3306')
db_user = os.environ.get('MYSQL_USER', 'user')
db_pass = os.environ.get('MYSQL_PASSWORD', 'userpassword')
db_name = os.environ.get('MYSQL_DATABASE', 'user_db')

# SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}'

db.init_app(app)
bcrypt = Bcrypt(app)


@app.route("/users")
def users():
    return {"message": "The Users is here"}


@app.route("/users/register", methods=['POST'])
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

    # Perform validation
    # check if user or email already in use
    if User.query.filter_by(username=username).first():
        abort(400, description="Username is already in use")
    elif User.query.filter_by(email=email).first():
        abort(400, description="Email is already in use")

    # check manager code is correct
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

    # hash password to prepare for storage
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


@app.route("/users/login", methods=['POST'])
def loginUser():
    data = request.json  # Get JSON payload from the client
    username = data.get('username', '')
    password = data.get('password', '')

    # this checks if username and password exist
    user = User.query.filter_by(username=username).first()
    if not user:
        abort(400, description="Incorrect Login")

    isPasswordCorrect = bcrypt.check_password_hash(user.password_hash, password)
    if not isPasswordCorrect:
        abort(400, description="Incorrect Login")

    try:
        #creating jwt
        jwt_token = create_jwt(user.id, user.company_id, user.position_name, user.status)

        # create response object
        res = make_response(jsonify({"message": "User authenticated"}))

        # add jwt to cookie
        res.set_cookie('user_cookie', jwt_token, httponly=True, secure=True, samesite='Strict')
        return res, 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': str(error.description)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


def generate_code(length=6):
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for i in range(length))


def get_all_manager_codes():
    return [result[0] for result in db.session.query(User.manager_code).distinct().all()]


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
