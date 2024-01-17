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
