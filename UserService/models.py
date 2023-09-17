from app import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum('Manager', 'Employee'), nullable=False)
    manager_code = db.Column(db.String(10))
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    manager = db.relationship('User', remote_side=[id], backref=db.backref('subordinates', lazy='dynamic'))

    def __repr__(self):
        return f'<User {self.username}>'