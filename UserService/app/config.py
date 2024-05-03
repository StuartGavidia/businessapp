"""
This module contains configuration settings for the application.

It currently includes settings for the database.
"""

import os

#Read database configuration from environment variables
db_host = os.environ.get('DATABASE_HOST', 'localhost')
db_port = os.environ.get('DATABASE_PORT', '3306')
db_user = os.environ.get('MYSQL_USER', 'user')
db_pass = os.environ.get('MYSQL_PASSWORD', 'userpassword')
db_name = os.environ.get('MYSQL_DATABASE', 'user_db')

class Config:
    """Base configuration."""
    TESTING = False

class ProductionConfig(Config):
    """Production configuration."""
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    ssl_args = {
        'ssl_ca': os.path.join(BASE_DIR, '..', 'certs', 'DigiCertGlobalRootCA.crt.pem'),
    }
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}?ssl_ca={ssl_args['ssl_ca']}"

class DevelopmentConfig(Config):
    """Development configuration."""
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}'

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
