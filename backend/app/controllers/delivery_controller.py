from flask import Blueprint, request, jsonify
from app.models.delivery_model import Delivery
from app.extensions import db
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND,
    HTTP_201_CREATED, HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
)

delivery_bp = Blueprint('delivery', __name__, url_prefix='/api/v1/deliveries')

# GET all deliveries
@delivery_bp.route('/', methods=['GET'])
def get_all_deliveries():
    deliveries = Delivery.query.all()
    delivery_list = [{
        "delivery_id": d.delivery_id,
        "order_id": d.order_id,
        "staff_id": d.staff_id,
        "delivery_address": d.delivery_address,
        "delivery_type": d.delivery_type,
        "delivery_status": d.delivery_status,
        "description": d.description,
        "delivery_date": d.delivery_date.isoformat() if d.delivery_date else None
    } for d in deliveries]
    return jsonify(delivery_list), HTTP_200_OK

# GET a single delivery by ID
@delivery_bp.route('/<int:id>', methods=['GET'])
def get_delivery(id):
    d = Delivery.query.get(id)
    if d is None:
        return jsonify({"message": "Delivery not found"}), HTTP_404_NOT_FOUND

    return jsonify({
        "delivery_id": d.delivery_id,
        "order_id": d.order_id,
        "staff_id": d.staff_id,
        "delivery_address": d.delivery_address,
        "delivery_type": d.delivery_type,
        "delivery_status": d.delivery_status,
        "description": d.description,
        "delivery_date": d.delivery_date.isoformat() if d.delivery_date else None
    }), HTTP_200_OK

# POST a new delivery
@delivery_bp.route('/register', methods=['POST'])
def create_delivery():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    required_fields = ['order_id', 'staff_id', 'delivery_address', 'delivery_type', 'delivery_status']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing field: {field}"}), HTTP_400_BAD_REQUEST

    try:
        new_delivery = Delivery(
            order_id=data['order_id'],
            staff_id=data['staff_id'],
            delivery_address=data['delivery_address'],
            delivery_type=data['delivery_type'],
            delivery_status=data['delivery_status'],
            description=data.get('description')
        )
        db.session.add(new_delivery)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create delivery", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

    return jsonify({"message": "Delivery created successfully", "delivery": {
        "delivery_id": new_delivery.delivery_id,
        "order_id": new_delivery.order_id,
        "staff_id": new_delivery.staff_id,
        "delivery_address": new_delivery.delivery_address,
        "delivery_type": new_delivery.delivery_type,
        "delivery_status": new_delivery.delivery_status,
        "description": new_delivery.description,
        "delivery_date": new_delivery.delivery_date.isoformat()
    }}), HTTP_201_CREATED

# PUT update
@delivery_bp.route('/<int:id>', methods=['PUT'])
def update_delivery(id):
    d = Delivery.query.get(id)
    if not d:
        return jsonify({"message": "Delivery not found"}), HTTP_404_NOT_FOUND

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    d.order_id = data.get('order_id', d.order_id)
    d.staff_id = data.get('staff_id', d.staff_id)
    d.delivery_address = data.get('delivery_address', d.delivery_address)
    d.delivery_type = data.get('delivery_type', d.delivery_type)
    d.delivery_status = data.get('delivery_status', d.delivery_status)
    d.description = data.get('description', d.description)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update delivery", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

    return jsonify({"message": "Delivery updated successfully", "delivery": {
        "delivery_id": d.delivery_id,
        "order_id": d.order_id,
        "staff_id": d.staff_id,
        "delivery_address": d.delivery_address,
        "delivery_type": d.delivery_type,
        "delivery_status": d.delivery_status,
        "description": d.description,
        "delivery_date": d.delivery_date.isoformat()
    }}), HTTP_200_OK

# DELETE
@delivery_bp.route('/<int:id>', methods=['DELETE'])
def delete_delivery(id):
    d = Delivery.query.get(id)
    if d is None:
        return jsonify({"message": "Delivery not found"}), HTTP_404_NOT_FOUND

    try:
        db.session.delete(d)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete delivery", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

    return jsonify({"message": "Delivery deleted successfully"}), HTTP_200_OK
