from app.extensions import db
from datetime import datetime

class AdminUser(db.Model):
    __tablename__ = "admin_users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True)
    full_name = db.Column(db.String(255), nullable=False)
    contact = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, index=True, nullable=False)  # Added index
    password = db.Column(db.String(255), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(50), default="staff")
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships - keep these as-is
    orders_handled = db.relationship("Order", back_populates="handler", lazy=True)
    deliveries = db.relationship("Delivery", back_populates="staff", lazy=True)
    
    def __init__(self, full_name, contact, email, password, address=None, role="staff", description=None):
        self.full_name = full_name
        self.contact = contact
        self.email = email
        self.password = password
        self.address = address
        self.role = role
        self.description = description
    