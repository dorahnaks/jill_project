from app.extensions import db
from datetime import datetime

class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(255), nullable=False)
    contact = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    customer_type = db.Column(db.String(50), default="individual")
    biography = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    orders = db.relationship("Order", back_populates="customer", lazy=True)
    catering_events = db.relationship("CateringEvent", back_populates="customer", lazy=True)

    def __init__(self, full_name, contact, email, password, address, customer_type, biography):
        self.full_name = full_name
        self.contact = contact
        self.email = email
        self.password = password
        self.address = address
        self.customer_type = customer_type
        self.biography = biography
