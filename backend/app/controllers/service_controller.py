from flask import Blueprint, request, jsonify
from app.models.service_model import Service
from app.extensions import db
import logging
import os

service_bp = Blueprint("service_bp", __name__, url_prefix="/api/v1/services")

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Get all services
@service_bp.route("/", methods=["GET"])
def get_services():
    services = Service.query.all()
    formatted_services = []
    for service in services:
        service_data = service.to_dict()
        # Construct the full URL for the service image
        service_data['image_url'] = f'/images/services/{os.path.basename(service.image_url)}'
        formatted_services.append(service_data)
    
    return jsonify(formatted_services), 200

# Get single service by slug
@service_bp.route("/<string:slug>", methods=["GET"])
def get_service(slug):
    service = Service.query.filter_by(slug=slug).first()
    if not service:
        return jsonify({"error": "Service not found"}), 404
    
    # Format the response with the correct URL
    response_data = service.to_dict()
    response_data['image_url'] = f'/images/services/{os.path.basename(service.image_url)}'
    
    return jsonify(response_data), 200

@service_bp.route("/register", methods=["POST"])
def register_service():
    data = request.get_json()
    new_service = Service(
        slug=data["slug"],
        title=data["title"],
        description=data["description"],
        image_url=data.get("image_url")  # Store original filename
    )
    db.session.add(new_service)
    db.session.commit()
    
    # Format the response with the correct URL
    response_data = new_service.to_dict()
    response_data['image_url'] = f'/images/services/{os.path.basename(new_service.image_url)}'
    
    return jsonify(response_data), 201

# Add new service
@service_bp.route("/", methods=["POST"])
def create_service():
    data = request.get_json()
    new_service = Service(
        slug=data["slug"],
        title=data["title"],
        description=data["description"],
        image_url=data.get("image_url")  # Store original filename
    )
    db.session.add(new_service)
    db.session.commit()
    
    # Format the response with the correct URL
    response_data = new_service.to_dict()
    response_data['image_url'] = f'/images/services/{os.path.basename(new_service.image_url)}'
    
    return jsonify(response_data), 201

# Update service
@service_bp.route("/<string:slug>", methods=["PUT"])
def update_service(slug):
    service = Service.query.filter_by(slug=slug).first()
    if not service:
        return jsonify({"error": "Service not found"}), 404
    data = request.get_json()
    service.title = data.get("title", service.title)
    service.description = data.get("description", service.description)
    service.image_url = data.get("image_url", service.image_url)  # Store original filename
    db.session.commit()
    
    # Format the response with the correct URL
    response_data = service.to_dict()
    response_data['image_url'] = f'/images/services/{os.path.basename(service.image_url)}'
    
    return jsonify(response_data), 200

# Delete service
@service_bp.route("/<string:slug>", methods=["DELETE"])
def delete_service(slug):
    service = Service.query.filter_by(slug=slug).first()
    if not service:
        return jsonify({"error": "Service not found"}), 404
    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service deleted"}), 200