"""
This module contains flask_sqlalchemy models that are mapped to the analytics database
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey

#Initialize SQLAlchemy
db = SQLAlchemy()

class Budget(db.Model):
    __tablename__ = 'budget'

    budget_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.String(255), nullable=False)
    account_name = db.Column(db.String(255), nullable=False)
    allowance = db.Column(db.Integer, nullable=False)
    budget_active = db.Column(db.Boolean, nullable=False)

class PlaidItem(db.Model):
    __tablename__ = 'plaid_item'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.String(255), nullable=False)
    access_token = db.Column(db.String(255), nullable=False)
    item_id = db.Column(db.String(255), nullable=False)

class RegularTransaction(db.Model):
    __tablename__ = 'regular_transaction'

    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.String(255), nullable=False)
    account_name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    descriptions = db.Column(db.String(255), nullable=False)
    budget_id = db.Column(db.Integer, nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False)

class IncomeTransaction(db.Model):
    __tablename__ = 'income_transaction'

    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    descriptions = db.Column(db.String(255), nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False)




