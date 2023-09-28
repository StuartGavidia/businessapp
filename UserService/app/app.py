from flask import Flask
from app.models import User, Company, db
from app.routes import routes
import os
from app.config import ProductionConfig, TestingConfig, DevelopmentConfig

def create_app(config_object = None):
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

    return app