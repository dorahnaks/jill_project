from app.extensions import db
from datetime import datetime

class Delivery(db.Model):
    __tablename__ = "deliveries"
    delivery_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('admin_users.id'), nullable=False)  # Match AdminUser
    delivery_address = db.Column(db.String(255), nullable=False)
    delivery_type = db.Column(db.String(100), nullable=False)
    delivery_status = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    delivery_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Corrected relationships
    order = db.relationship('Order', back_populates='delivery')
    staff = db.relationship('AdminUser', back_populates='deliveries')  # Match AdminUser

    def __init__(self, order_id, staff_id, delivery_address, delivery_type, delivery_status, description=None):
        self.order_id = order_id
        self.staff_id = staff_id
        self.delivery_address = delivery_address
        self.delivery_type = delivery_type
        self.delivery_status = delivery_status
        self.description = description