from app.extensions import db
from datetime import datetime


class CateringEvent(db.Model):
    __tablename__ = "catering_events"

    id = db.Column(db.Integer, primary_key=True, index=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.id"), nullable=False, index=True)

    event_name = db.Column(db.String(255), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    location = db.Column(db.String(255), nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)
    menu = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(100), nullable=False, default="pending")
    description = db.Column(db.String(255), nullable=True)

    customer = db.relationship("Customer", back_populates="catering_events")

    def __init__(self, customer_id, event_name, event_date, location, number_of_guests, menu, status="pending", description=None):
        self.customer_id = customer_id
        self.event_name = event_name
        self.event_date = event_date
        self.location = location
        self.number_of_guests = number_of_guests
        self.menu = menu
        self.status = status
        self.description = description
