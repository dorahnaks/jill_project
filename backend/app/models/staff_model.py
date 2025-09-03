from app.extensions import db
from datetime import datetime

class Staff(db.Model):
    __tablename__ = "staff"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(255), nullable=False)
    contact = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, index=True, nullable=False)
    password = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(100), default="individual")
    description = db.Column(db.String(255), nullable=True)
    hire_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    vehicle = db.relationship('Vehicle', back_populates='staff', uselist=False)

    def __init__(self, full_name, contact, email, password, address, role, description, hire_date):
        self.full_name = full_name
        self.contact = contact
        self.email = email
        self.password = password
        self.address = address
        self.role = role
        self.description = description
        self.hire_date = hire_date or datetime.utcnow()
