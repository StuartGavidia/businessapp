"""
This module intializes the flask app
"""

import os
from flask import Flask
from flask_cors import CORS
from app.models import db
from app.routes import routes
from app.config import ProductionConfig, TestingConfig, DevelopmentConfig

def create_app(config_object = None):
    """
    Takes a config_object and initializes a flask app
    """
    app = Flask(__name__)

    if config_object:
        app.config.from_object(config_object)
    else:
        env = os.environ.get('FLASK_ENV', 'development')
        if env == 'production':
            app.config.from_object(ProductionConfig)
        elif env == 'testing':
            app.config.from_object(TestingConfig)
        else:
            app.config.from_object(DevelopmentConfig)

    db.init_app(app)

    app.register_blueprint(routes)

    CORS(app, supports_credentials=True)

    return app
