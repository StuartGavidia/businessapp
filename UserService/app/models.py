"""
This module contains flask_sqlalchemy models that are mapped to the user database
"""

from flask_sqlalchemy import SQLAlchemy

#Initialize SQLAlchemy
db = SQLAlchemy()

class Industry(db.Model):
    """
    The Industry table contains information related to the different industries
    """
    __tablename__ = 'industries'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    # relationships
    companies = db.relationship('Company', back_populates='industry')
    features = db.relationship('Feature', back_populates='industry')

class Company(db.Model):
    """
    The Companies table contains information related to the different companies
    """
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    company_code = db.Column(db.String(10), unique=True, nullable=False)
    industry_id = db.Column(db.Integer, db.ForeignKey('industries.id'))
    ceo_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    # relationships
    industry = db.relationship('Industry', back_populates='companies')
    company_features = db.relationship('CompanyFeature', back_populates='company')
    ceo = db.relationship('User', foreign_keys=[ceo_id], back_populates='company_as_ceo')
    users = db.relationship('User', foreign_keys='User.company_id', back_populates='company')

class User(db.Model):
    """
    The Users table contains information related to all users
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    position_name = db.Column(db.String(50), nullable=False)
    manager_code = db.Column(db.String(10), unique=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    status = db.Column(db.Enum('Active', 'Inactive'), nullable=False, default='Active')

    # relationships
    manager = db.relationship(
        'User', remote_side=[id], backref=db.backref('subordinates', lazy='dynamic'))
    user_permissions = db.relationship('UserPermission', back_populates='user')
    company = db.relationship('Company', foreign_keys='User.company_id', back_populates='users')
    company_as_ceo = db.relationship('Company', foreign_keys=[Company.ceo_id], back_populates='ceo')

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        """
        Used for converting model to a structure to send to client
        """
        return {
        'id': self.id,
        'username': self.username,
        'first_name': self.first_name,
        'last_name': self.last_name,
        'position_name': self.position_name,
        'company_id': self.company_id,
        'status': self.status
      }

class Feature(db.Model):
    """
    The Feature table contains information related to different features available
    """
    __tablename__ = 'features'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)
    industry_id = db.Column(db.Integer, db.ForeignKey('industries.id'))

    # relationships
    industry = db.relationship('Industry', back_populates='features')
    company_features = db.relationship('CompanyFeature', back_populates='feature')

class CompanyFeature(db.Model):
    """
    The CompanyFeature table is a junction table to normalize the many to many relationships
    between Company and Feature
    """
    __tablename__ = 'company_features'

    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), primary_key=True)
    feature_id = db.Column(db.Integer, db.ForeignKey('features.id'), primary_key=True)
    enabled = db.Column(db.Boolean, default=True)

    # relationships
    company = db.relationship('Company', back_populates='company_features')
    feature = db.relationship('Feature', back_populates='company_features')

class Permission(db.Model):
    """
    The Permission table contains information related to different existing permissions
    """
    __tablename__ = 'permissions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=False)

    # relationships
    user_permissions = db.relationship('UserPermission', back_populates='permission')

class UserPermission(db.Model):
    """
    The UserPermission table is a junction table to normalize the many to many relationships
    between User and Permission
    """
    __tablename__ = 'user_permissions'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    permission_id = db.Column(db.Integer, db.ForeignKey('permissions.id'), primary_key=True)
    granted = db.Column(db.Boolean, default=True)

    # relationships
    user = db.relationship('User', back_populates='user_permissions')
    permission = db.relationship('Permission', back_populates='user_permissions')
