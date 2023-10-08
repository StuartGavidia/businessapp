import pytest
from flask import url_for
from app.app import create_app
from app.models import db as _db
from app.config import TestingConfig

@pytest.fixture(scope='function')
def app():
    _app = create_app(TestingConfig)
    return _app

@pytest.fixture(scope='function')
def client(app):
    return app.test_client()

@pytest.fixture(scope='function')
def db(app):
    _db.app = app
    _db.create_all()

@pytest.mark.usefixtures('app', 'client', 'db')
class TestRoutes:
    def test_example_route(self, client):
        response = client.get(url_for('routes.analytics'))
        assert response.status_code == 200