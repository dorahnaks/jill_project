from app.extensions import db
from datetime import datetime

class Vehicle(db.Model):
    __tablename__ = "vehicles"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, index=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), unique=True, nullable=False)
    vehicle_type = db.Column(db.String(255), nullable=False)
    plate_number = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(255), nullable=True)

    staff = db.relationship('Staff', back_populates='vehicle')

    def __init__(self, staff_id, vehicle_type, plate_number, status=None, description=None):
        self.staff_id = staff_id
        self.vehicle_type = vehicle_type
        self.plate_number = plate_number
        self.status = status
        self.description = description
