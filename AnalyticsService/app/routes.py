"""
This module defines the different routes for the flask app
"""

import os
from dotenv import load_dotenv
from flask import Blueprint
import time
import json
from datetime import date, timedelta
from app.models import Budget, PlaidItem, RegularTransaction, IncomeTransaction, db
from flask import Blueprint, jsonify, request, abort, make_response
from app.decorators import token_required
from app.utils import decode_jwt
from datetime import datetime
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.country_code import CountryCode
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest


load_dotenv()

routes = Blueprint('routes', __name__)

PLAID_CLIENT_ID = os.getenv('PLAID_CLIENT_ID')
PLAID_SECRET = os.getenv('PLAID_SECRET')
PLAID_ENV = os.getenv('PLAID_ENV', 'sandbox')
PLAID_PRODUCTS = os.getenv('PLAID_PRODUCTS', 'transactions').split(',')
PLAID_COUNTRY_CODES = os.getenv('PLAID_COUNTRY_CODES', 'US').split(',')
PLAID_REDIRECT_URI = os.getenv('PLAID_REDIRECT_URI')

# using sandbox environment for testing

configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        'clientId': PLAID_CLIENT_ID,
        'secret': PLAID_SECRET,
    }
)

api_client = plaid.ApiClient(configuration)
client = plaid_api.PlaidApi(api_client)

# access token for making requests to plaid
access_token = None

# replace with client_id?
item_id = None

@routes.route("/analytics")
def analytics():
    """Test route"""
    return {"message": "Analytics Service Data is here"}

@routes.route('/analytics/createLinkToken', methods=['POST'])
def create_link_token():

    # Create a link_token for the given user
    request = LinkTokenCreateRequest(
            products=[Products("transactions")],
            client_name="PLU Capstone",
            country_codes=[CountryCode('US')],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(time.time())
            )
        )
    
    response = client.link_token_create(request)
    # Send the data to the client
    return jsonify(response.to_dict())
    
@routes.route('/analytics/setAccessToken', methods=['POST'])
def get_access_token():
    
    # Initialize access_token and item_id
    access_token = None
    item_id = None

    # Grab Company Id for DB entry paired with Access Token.
    company_token = request.cookies.get('user_cookie')
    payload = None

    payload = decode_jwt(company_token)
    company_id = payload['company_id']

    # Grab Public Token for Access Token Exchange
    data = request.json
    public_token = data.get('public_token', '')
    
    # Verify Access Token has been recieved in request body.
    #print("Access Token:", public_token)

    try:
        exchange_request = ItemPublicTokenExchangeRequest(
            public_token=public_token)
        
        exchange_response = client.item_public_token_exchange(exchange_request)
        access_token = exchange_response['access_token']
        item_id = exchange_response['item_id']

        # Add new Plaid Item to DB
        new_item = PlaidItem(
            company_id=company_id,
            access_token=access_token,
            item_id=item_id
        )

        db.session.add(new_item)
        db.session.commit()

        return jsonify(exchange_response.to_dict())
    
    except plaid.ApiException as e:
        return json.loads(e.body)
    
@routes.route('/analytics/balance', methods=['GET'])
def get_balance():

    # Grab Company ID to query user's Access Token
    company_id = request.cookies.get('user_cookie')
    payload = None

    payload = decode_jwt(company_id)
    company_id = payload['company_id']

    item = PlaidItem.query.filter_by(company_id=company_id).first()

    try:
        balance_request = AccountsBalanceGetRequest(
            access_token=item.access_token
        )
        response = client.accounts_balance_get(balance_request)
        return jsonify(response.to_dict())
    
    except plaid.ApiException as e:
        return json.loads(e.body)
    
@routes.route("/analytics/transactions", methods=["GET"])
def get_transactions():

    # Set cursor to empty to receive all historical updates
    cursor = ''

    # New transaction updates since "cursor"
    added = []
    modified = []
    removed = [] # Removed transaction ids
    has_more = True

    #Grab Company ID for querying correct Access Token
    company_id = request.cookies.get('user_cookie')
    payload = None

    payload = decode_jwt(company_id)
    company_id = payload['company_id']

    item = PlaidItem.query.filter_by(company_id=company_id).first()

    try:
        # Iterate through each page of new transaction updates for item

        while has_more:
            transaction_request = TransactionsSyncRequest(
                access_token=item.access_token,
                cursor=cursor
            )

            response = client.transactions_sync(transaction_request).to_dict()

            # Add this page of results
            added.extend(response['added'])
            modified.extend(response['modified'])
            removed.extend(response['removed'])
            has_more = response['has_more']

            # Update cursor to the next cursor
            cursor = response['next_cursor']

        # Return the 8 most recent transactions
        transactions = sorted(added, key=lambda t: t['date'])[-15:]

        formatted_transactions = []
        
        for transaction in transactions:
            formatted_date = transaction['date'].strftime('%a, %d %b %Y')

            # Append the formatted data to transaction_data
            formatted_transactions.append({
                'account_name': transaction['category'],
                'amount': transaction['amount'],
                'descriptions': transaction['name'],
                'transaction_date': formatted_date
            })

        return jsonify(formatted_transactions), 201
    
    except plaid.ApiException as e:
        return json.loads(e.body)
    
@routes.route("/analytics/getPlaidUser", methods=['GET'])
def getPlaidUser():

    token = request.cookies.get('user_cookie')
    payload = None

    payload = decode_jwt(token)
    company_id = payload['company_id']

    try:
        item = PlaidItem.query.filter_by(company_id=company_id).first()

        if item:
            return jsonify({"exists": True}), 201
        else:
            return jsonify({"exists": False}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes.route("/analytics/budget", methods=["POST"])
def create_budget():
    """
    This route creates a budget 
    """

    token = request.cookies.get('user_cookie')
    payload = None

    payload = decode_jwt(token)
    company_id = payload['company_id']

    data = request.json
    account_name = data.get('account_name', '')
    allowance = data.get('allowance', '')

    new_budget = Budget(
        company_id=company_id,
        account_name=account_name,
        allowance=allowance,
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
     
@routes.route("/analytics/createRegularTransaction", methods=["POST"]) 
def create_regular_transaction():
    """
    This route creates a regular transaction
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
        transaction_date = datetime.now().strftime('%Y-%m-%d')


        budgets = Budget.query.filter_by(company_id=company_id, account_name=account_name, budget_active=True)
        budget_data = [{'budget_id': budget.budget_id} for budget in budgets]

        budget_id=budget_data[0]['budget_id']

        new_transaction = RegularTransaction(
            company_id=company_id,
            account_name=account_name,
            amount=amount,
            descriptions=descriptions,
            budget_id=budget_id,
            transaction_date=transaction_date

        )
        
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({"message": "Transaction successfully created"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@routes.route("/analytics/fetchRegularTransactionData", methods=["GET"])
def fetch_regular_transaction_data():
    try:
        transactions = RegularTransaction.query.all()
        transaction_data = []
        
        for transaction in transactions:
            formatted_date = transaction.transaction_date.strftime('%a, %d %b %Y')

            # Append the formatted data to transaction_data
            transaction_data.append({
                'account_name': transaction.account_name,
                'amount': transaction.amount,
                'descriptions': transaction.descriptions,
                'transaction_date': formatted_date 
            })

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
            transactions_to_delete = RegularTransaction.query.filter_by(budget_id=budget_to_delete.budget_id).all()

            for transaction in transactions_to_delete:
                db.session.delete(transaction)

            db.session.delete(budget_to_delete)
            db.session.commit()

            return jsonify({"message": "Budget successfully deleted!"}), 201
        else:
            return jsonify(None), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@routes.route("/analytics/createIncomeTransaction", methods=["POST"])
def create_income_transaction():
    """
    This route creates an income transaction
    """
    try:
        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']

        data = request.json
        amount = data.get('amount', '')
        descriptions = data.get('descriptions', '')

        #Convert date entry to match Plaid date entry
        transaction_date = datetime.now()

        # Format the date as 'Wed, 21 Feb 2024'
        formatted_date = transaction_date.strftime('%a, %d %b %Y')
        
        new_transaction = IncomeTransaction(
            company_id=company_id,
            amount=amount,
            descriptions=descriptions,
            transaction_date=formatted_date
        )
        
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify({"message": "Transaction successfully created"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
  
@routes.route("/analytics/createPlaidBudgets", methods=["POST"])
def create_plaid_budgets():

    try:
        token = request.cookies.get('user_cookie')
        payload = None

        payload = decode_jwt(token)
        company_id = payload['company_id']
        budget_date = datetime.now()

        transactions = request.json

        # Fetch existing budgets
        existing_budgets = Budget.query.filter_by(company_id=company_id).all()
        existing_budget_accounts = [budget.account_name for budget in existing_budgets]

        #Fetch unique account names from Plaid Transaction Data
        unique_plaid_accounts = set()

        for transaction in transactions:
            unique_plaid_accounts.add(transaction['account_name'][0])

        #CREATE ALLOWANCE BY FINDING TOTAL SPEND LAST MONTH

        if unique_plaid_accounts:
            for account_name in unique_plaid_accounts:
                if account_name not in existing_budget_accounts:

                    current_date = datetime.now()

                    first_day_last_month = current_date.replace(day=1) - timedelta(days=1)
                    first_day_last_month_normalized = first_day_last_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

                    last_day_last_month = current_date.replace(day=1) - timedelta(days=1)
                    last_day_last_month_normalized = last_day_last_month.replace(hour=0, minute=0, second=0, microsecond=0)        


                    """ Debugging Time Comparison """

                    """
                    print("first day of last month", first_day_last_month_normalized)

                    for transaction in transactions:
                        transaction_date = datetime.strptime(transaction['transaction_date'], '%a, %d %b %Y')
                        print("Transaction date:", transaction_date)
                        if first_day_last_month_normalized <= transaction_date <= last_day_last_month_normalized:
                            print("Transaction falls within the date range")
                        else:
                            print("Transaction does not fall within the date range")
                    """
                        
                    # Filter transactions for this account last month
                    transactions_last_month = [transaction for transaction in transactions 
                                       if transaction['account_name'][0] == account_name and
                                       first_day_last_month_normalized <= datetime.strptime(transaction['transaction_date'], '%a, %d %b %Y') <= last_day_last_month_normalized]        
                    
                    # Sum total amount spent for this account last month
                    allowance = abs(sum(transaction['amount'] for transaction in transactions_last_month))
                            
                    new_budget = Budget(
                    company_id=company_id,
                    account_name=account_name,
                    allowance=allowance,
                    budget_active=True

                    )

                    db.session.add(new_budget)

            db.session.commit()

        return jsonify({"message": "Plaid budget successfully created"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    

    


    


    