"""
This module defines the different routes for the flask app
"""

import os
from flask import Blueprint
from app.models import Budget, StripeAccount, db
from flask import Blueprint, jsonify, request, abort, make_response
from app.decorators import token_required
from app.utils import decode_jwt
import stripe
from stripe.error import StripeError

routes = Blueprint('routes', __name__)

#Set Stripe API Key
stripe.api_key = "sk_test_51O4uCWFy63ZKr0XemD3A1rCloE3Su65QRVkFPIWiQ5wgemqAUJOSOJtoSeKVxkKpSXRdMjWp0nRn31rvtWrQ26sY00ffEdglnR"

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

@routes.route("/analytics/budget", methods=['GET'])
def get_budget_data():
    try:
        budgets = Budget.query.all()
        budget_data = [{'id': budget.id, 'account_name': budget.account_name, 'allowance': budget.allowance} for budget in budgets]
        return jsonify(budget_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@routes.route("/analytics/createStripeCustomer", methods=["POST"])

def create_stripe_customer():
    
    try:
        token = request.cookies.get('user_cookie')
        payload = None
        
        payload = decode_jwt(token)

        first_name = payload['first_name']
        company_id = payload['company_id']

        existing_account_check = StripeAccount.query.filter_by(company_id=company_id).first()

        if not existing_account_check:

            customer = stripe.Customer.create(
                name=first_name
            )

            print(customer)
            customer_id=customer.stripe_id

            new_account = StripeAccount(
                company_id=company_id,
                customer_id=customer_id
            ) 

            db.session.add(new_account)
            db.session.commit()

            return jsonify({"success": True, "message": "Stripe customer created successfully"}), 200
        
        else:
            return jsonify({"success": False, "error": "Stripe Customer already exists"}), 200
        
    except StripeError as e:
                print('Error creating Stripe customer:', str(e))
                return jsonify({"success": False, "error": str(e)}), 500
    
@routes.route("/analytics/createStripeCustomer", methods=["GET"])

def get_stripe_customer():
    
    try:
        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']

        customer_id = StripeAccount.query.filter_by(company_id=company_id).customer_id()

    except Exception as e:
        jsonify({"error": str(e)}), 500

    
    