"""
This module contains flask_sqlalchemy models that are mapped to the analytics database
"""

from flask_sqlalchemy import SQLAlchemy

#Initialize SQLAlchemy
db = SQLAlchemy()

class Budget(db.Model):
    __tablename__ = 'budget'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    account_name = db.Column(db.String(255), nullable=False)
    budget_date = db.Column(db.DateTime, nullable=True)
    allowance = db.Column(db.Integer, nullable=False)
    occurance = db.Column(db.Integer, nullable=False)

class StripeAccount(db.Model):
    __tablename__ = 'stripe_account'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.String(255), nullable=False)
    customer_id = db.Column(db.String(255), nullable=False)
    account_id = db.Column(db.String(225))

    @classmethod
    def store_account_id(cls, customer_id, account_id):
        try:
            stripe_account = cls.query.filter_by(customer_id=customer_id).first()

            if stripe_account:
                stripe_account.account_id = account_id
                db.session.commit()
                return True, "Account ID updated successfully"
            else:
                return False, "Stripe account not found for customer_id: {}".format(customer_id)
        except Exception as e:
            return False, str(e)

class Transaction(db.Model):
    __tablename__ = 'transaction'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    company_id = db.Column(db.String(255), nullable=False)
    account_name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    descriptions = db.Column(db.String(255), nullable=False)

