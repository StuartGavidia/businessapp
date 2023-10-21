# pylint: disable=redefined-outer-name
"""
This module tests the routes.py class
"""

import pytest
from flask import url_for
from app.app import create_app
from app.models import db as _db
from app.config import TestingConfig

@pytest.fixture(scope='function')
def app():
    """
    Fixture to create app
    """
    _app = create_app(TestingConfig)
    return _app

@pytest.fixture(scope='function')
def client(app):
    """
    Fixture to mock client
    """
    return app.test_client()

@pytest.fixture(scope='function')
def db(app):
    """
    Fixture to initialize test database
    """
    _db.app = app
    _db.create_all()

@pytest.mark.usefixtures('app', 'client', 'db')
class TestRoutes:
    """
    routes.py test class
    """
    def test_example_route(self, client):
        """
        Assert that test route returns data
        """
        response = client.get(url_for('routes.analytics'))
        assert response.status_code == 200
