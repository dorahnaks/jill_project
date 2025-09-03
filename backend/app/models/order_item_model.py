from app.extensions import db

class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey("menu_items.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)

    # Relationships
    order = db.relationship("Order", back_populates="order_items")
    menu_item = db.relationship("MenuItem", back_populates="order_items")  # Must match MenuItem.order_items
