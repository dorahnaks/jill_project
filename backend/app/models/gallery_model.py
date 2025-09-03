# app/models/gallery_model.py
from app.extensions import db

class GalleryImage(db.Model):
    __tablename__ = 'gallery_images'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "image_url": self.image_url,
            "description": self.description
        }