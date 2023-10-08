from flask import Blueprint

routes = Blueprint('routes', __name__)

@routes.route("/analytics")
def analytics():
    return {"message": "Analytics Service Data is here"}