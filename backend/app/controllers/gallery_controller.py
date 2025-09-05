from flask import Blueprint, request, jsonify
from app.models.gallery_model import GalleryImage
from app.extensions import db
import logging
import os

gallery_bp = Blueprint("gallery_bp", __name__, url_prefix="/api/v1/gallery")

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Get all images
@gallery_bp.route("/", methods=["GET"])
def get_images():
    try:
        images = GalleryImage.query.all()
        formatted_images = []
        for img in images:
            image_data = img.to_dict()
            # Construct URL using /static/gallery/ path
            image_data['image_url'] = f'/static/gallery/{os.path.basename(img.image_url)}'
            formatted_images.append(image_data)
        
        return jsonify(formatted_images), 200
    except Exception as e:
        logger.error(f"Error fetching gallery images: {str(e)}")
        return jsonify({"error": "Failed to fetch images", "details": str(e)}), 500

# Add a new image
@gallery_bp.route("/", methods=["POST"])
def add_image():
    try:
        data = request.get_json()
        if not data or "image_url" not in data:
            return jsonify({"error": "image_url is required"}), 400
            
        # Store only filename (path handled by static serving)
        filename = os.path.basename(data["image_url"])
        new_image = GalleryImage(
            title=data.get("title", "Untitled"),
            image_url=filename,
            description=data.get("description", "")
        )
        
        db.session.add(new_image)
        db.session.commit()
        
        # Return with correct URL
        response_data = new_image.to_dict()
        response_data['image_url'] = f'/static/gallery/{filename}'
        
        return jsonify(response_data), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding gallery image: {str(e)}")
        return jsonify({"error": "Failed to add image", "details": str(e)}), 500

# Delete image
@gallery_bp.route("/<int:id>", methods=["DELETE"])
def delete_image(id):
    try:
        image = GalleryImage.query.get(id)
        if not image:
            return jsonify({"error": "Image not found"}), 404
            
        # Remove file from disk
        file_path = os.path.join(os.getcwd(), "app", "static", "gallery", image.image_url)
        if os.path.exists(file_path):
            os.remove(file_path)
            
        db.session.delete(image)
        db.session.commit()
        
        return jsonify({"message": "Image deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting gallery image: {str(e)}")
        return jsonify({"error": "Failed to delete image", "details": str(e)}), 500