"""
This module defines the different routes for the flask app
"""

import os
from flask import Blueprint
from app.models import Budget, StripeAccount, Transaction, db
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
    company_id = payload['company_id']

    data = request.json
    company_id = payload['company_id']
    account_name = data.get('account_name', '')
    allowance = data.get('allowance', '')
    budget_date = data.get('budget_date', '')
    occurance = data.get('occurance', '')

    new_budget = Budget(
        company_id=company_id,
        account_name=account_name,
        allowance=allowance,
        budget_date=budget_date,
        occurance=occurance,
        budget_active=True
    )
    
    db.session.add(new_budget)
    db.session.commit()

    return jsonify({"message": "Budget successfully created"}), 201

@routes.route("/analytics/budget", methods=['GET'])

def get_budget_data():
    try:

        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']

        budgets = Budget.query.filter_by(company_id=company_id, budget_active=True)
        budget_data = [{'budget_id': budget.budget_id, 'account_name': budget.account_name, 'allowance': budget.allowance} for budget in budgets]
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
    
@routes.route("/analytics/createFinancialConnectionsSession", methods=["POST"])

def create_financial_connections_session():

    try:
        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']

        customer_id = StripeAccount.query.filter_by(company_id=company_id).first().customer_id

        print("customer id:", customer_id)

        session = stripe.financial_connections.Session.create(
            account_holder={"type": "customer", "customer": customer_id},
            permissions=["balances", "ownership", "payment_method", "transactions"]
        )  

        print(session)

        client_secret = session.client_secret
        
        return jsonify(client_secret), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@routes.route("/analytics/stripeAccountID", methods=["POST", "GET"]) 

def store_stripe_account_id():
     
    try:
        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']

        data = request.json
        account_id = data.get('accountId', '')
        customer_id = StripeAccount.query.filter_by(company_id=company_id).first().customer_id

        StripeAccount.store_account_id(customer_id, account_id)

        return jsonify({"success": True, "message": "Stripe Account ID added to Stripe Customer"}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@routes.route("/analytics/checkStripeAccountID", methods=["GET"])

def check_stripe_account_id():
     try:
          token = request.cookies.get('user_cookie')
          payload = None

          payload = decode_jwt(token)
          company_id = payload['company_id']

          account_id = StripeAccount.query.filter_by(company_id=company_id).first().account_id

          if account_id:
               return jsonify(True), 200
          else:
               return jsonify(False), 200
          
     except Exception as e:
        return jsonify({"error": str(e)}), 500
     
@routes.route("/analytics/getStripeBalance", methods=["GET"])

def get_stripe_balance():
     
     try:
     
        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']

        account_id = StripeAccount.query.filter_by(company_id=company_id).first().account_id

        user_balance = stripe.financial_connections.Account.retrieve(account_id)

        if user_balance:
            return jsonify(user_balance), 200
        else:
            return jsonify(None), 200
     
     except Exception as e:
         return jsonify({"error": str(e)}), 500
     
@routes.route("/analytics/createTransaction", methods=["POST"])
     
def create_transaction():
    """
    This route creates a transaction
    """
    try:
        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']

        data = request.json
        account_name = data.get('account_name', '')
        amount = data.get('amount', '')
        descriptions = data.get('descriptions', '')

        budgets = Budget.query.filter_by(company_id=company_id, account_name=account_name, budget_active=True)
        budget_data = [{'budget_id': budget.budget_id} for budget in budgets]

        budget_id=budget_data[0]['budget_id']
        print("budget_id:", budget_data[0]['budget_id'])

        new_transaction = Transaction(
            company_id=company_id,
            account_name=account_name,
            amount=amount,
            descriptions=descriptions,
            budget_id=budget_id
        )
        
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({"message": "Transaction successfully created"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@routes.route("/analytics/fetchTransactionData", methods=["GET"])

def fetch_transaction_data():
    try:
        transactions = Transaction.query.all()
        transaction_data = [{'account_name': transaction.account_name, 'amount': transaction.amount, 'descriptions': transaction.descriptions} for transaction in transactions]
        return jsonify(transaction_data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@routes.route("/analytics/deleteBudget", methods=["POST"])

def delete_budget():

    try:
        token = request.cookies.get('user_cookie')
        payload = None
        
        payload = decode_jwt(token)
        company_id = payload['company_id']

        data = request.json
        account_name = data.get('account_name', '')

        budget_to_delete = Budget.query.filter_by(company_id=company_id, account_name=account_name, budget_active=True).first()

        if budget_to_delete:
            transactions_to_delete = Transaction.query.filter_by(budget_id=budget_to_delete.budget_id).all()
            print(transactions_to_delete)

            for transaction in transactions_to_delete:
                print(transaction)
                db.session.delete(transaction)

            db.session.delete(budget_to_delete)
            db.session.commit()

            return jsonify({"message": "Transaction successfully created"}), 201
        else:
            return jsonify(None), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    


    