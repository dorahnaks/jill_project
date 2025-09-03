from app.extensions import db
from datetime import datetime

class MenuItem(db.Model):
    __tablename__ = "menu_items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    available = db.Column(db.Boolean, default=True, nullable=False)
    category = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image_key = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Add this relationship back
    order_items = db.relationship("OrderItem", back_populates="menu_item", lazy=True)

    def __init__(self, name, category, price, description=None, available=True, image_key=None):
        self.name = name
        self.category = category
        self.price = price
        self.description = description
        self.available = available
        self.image_key = image_key
        if not self.image_key:
            self.image_key = "meal_default"