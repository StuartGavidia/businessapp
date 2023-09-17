from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

#Read database configuration from environment variables
db_host = os.environ.get('DATABASE_HOST', 'localhost')
db_port = os.environ.get('DATABASE_PORT', '3306')
db_user = os.environ.get('MYSQL_USER', 'user')
db_pass = os.environ.get('MYSQL_PASSWORD', 'userpassword')
db_name = os.environ.get('MYSQL_DATABASE', 'user_db')

#SQLAlchemy database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}'

#Initialize SQLAlchemy
db = SQLAlchemy(app)

@app.route("/users")
def hello_world2():
    return "<p>Welcome to the User Service!</p>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

