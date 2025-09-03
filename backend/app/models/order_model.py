from app.extensions import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_status = db.Column(db.String(100), nullable=False)
    delivery_status = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)

    # Relationships
    customer = db.relationship("Customer", back_populates="orders")
    handler = db.relationship("User", back_populates="orders_handled")
    order_items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan", lazy=True)
    delivery = db.relationship("Delivery", back_populates="order", uselist=False)

    def __init__(self, customer_id, total_amount, payment_status, delivery_status, description=None, user_id=None):
        self.customer_id = customer_id
        self.total_amount = total_amount
        self.payment_status = payment_status
        self.delivery_status = delivery_status
        self.description = description
        self.user_id = user_id