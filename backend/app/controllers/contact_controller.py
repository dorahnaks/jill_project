# app/controllers/contact_controller.py
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.contact_model import Contact  # We'll define this model next
from app.status_codes import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
import logging

contact_bp = Blueprint("contact_bp", __name__, url_prefix="/api/v1/contact")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# POST /api/v1/contact - submit a new contact message
@contact_bp.route("/", methods=["POST"])
def submit_contact():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    service_type = data.get("service_type")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"message": "Name, email, and message are required"}), HTTP_400_BAD_REQUEST

    try:
        contact = Contact(
            name=name,
            email=email,
            phone=phone,
            service_type=service_type,
            message=message
        )
        db.session.add(contact)
        db.session.commit()

        logger.info(f"New contact submitted by {name} ({email})")
        return jsonify({"message": "Contact message submitted successfully"}), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error saving contact: {str(e)}")
        return jsonify({"message": "Failed to submit contact message", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR
