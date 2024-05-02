"""
This module initializes the flask app
"""

import os
from flask import Flask
from app.config import ProductionConfig, TestingConfig, DevelopmentConfig
from app.models import db
from app.routes import routes

app = Flask(__name__)

def setup_app(app):
    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'production':
        app.config.from_object(ProductionConfig)
    elif env == 'testing':
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    db.init_app(app)
    app.register_blueprint(routes)

setup_app(app)
