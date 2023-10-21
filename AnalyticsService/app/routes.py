"""
This module defines the different routes for the flask app
"""

from flask import Blueprint

routes = Blueprint('routes', __name__)

@routes.route("/analytics")
def analytics():
    """Test route"""
    return {"message": "Analytics Service Data is here"}
