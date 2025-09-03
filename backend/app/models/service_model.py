from flask_sqlalchemy import SQLAlchemy
from app.extensions import db
from datetime import datetime


class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(100), unique=True, nullable=False)  
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255), nullable=True) 

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "description": self.description,
            "image_url": self.image_url,
        }
