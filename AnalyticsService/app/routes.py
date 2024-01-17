"""
This module defines the different routes for the flask app
"""

import os
from flask import Blueprint
from app.models import Budget, db
from flask import Blueprint, jsonify, request, abort, make_response
from app.decorators import token_required
from app.utils import decode_jwt


routes = Blueprint('routes', __name__)

@routes.route("/analytics")
def analytics():
    """Test route"""
    return {"message": "Analytics Service Data is here"}

@routes.route("/analytics/budget", methods=['POST'])

#add back authentication
def create_budget():
    """
    This route creates a budget 
    """
    token = request.cookies.get('user_cookie')
    payload = None

    payload = decode_jwt(token)

    data = request.json
    #company_id = payload['company_id']
    account_name = data.get('account_name', '')
    allowance = data.get('allowance', '')
    budget_date = data.get('budget_date', '')
    occurance = data.get('occurance', '')

    new_budget = Budget(
        #company_id=company_id,
        account_name=account_name,
        allowance=allowance,
        budget_date=budget_date,
        occurance=occurance
    )
    
    db.session.add(new_budget)
    db.session.commit()

    return jsonify({"message": "Budget successfully created"}), 201
