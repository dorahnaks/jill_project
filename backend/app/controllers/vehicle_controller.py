from flask import Blueprint, request, jsonify
from app.models.vehicle_model import Vehicle
from app.extensions import db

vehicle_bp = Blueprint('vehicle_bp', __name__, url_prefix='/api/v1/vehicles')

# GET all vehicles
@vehicle_bp.route('/', methods=['GET'])
def get_vehicles():
    vehicles = Vehicle.query.all()
    result = [
        {
            "id": v.id,
            "vehicle_type": v.vehicle_type,
            "plate_number": v.plate_number,
            "staff_id": v.staff_id,
            "status": v.status,
            "description": v.description
        }
        for v in vehicles
    ]
    return jsonify(result), 200

# GET a single vehicle by ID
@vehicle_bp.route('/<int:id>', methods=['GET'])
def get_vehicle(id):
    vehicle = Vehicle.query.get(id)
    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404
    return jsonify({
        "id": vehicle.id,
        "vehicle_type": vehicle.vehicle_type,
        "plate_number": vehicle.plate_number,
        "staff_id": vehicle.staff_id,
        "status": vehicle.status,
        "description": vehicle.description
    }), 200

# POST create a new vehicle
@vehicle_bp.route('/register', methods=['POST'])
def create_vehicle():
    data = request.get_json()
    required_fields = ["vehicle_type", "plate_number", "staff_id"]
    if not all(field in data for field in required_fields):
        return jsonify({"message": f"Missing required fields: {', '.join(required_fields)}"}), 400

    vehicle = Vehicle(
        vehicle_type=data['vehicle_type'],
        plate_number=data['plate_number'],
        staff_id=data['staff_id'],
        status=data.get('status'),
        description=data.get('description')
    )
    db.session.add(vehicle)
    db.session.commit()
    return jsonify({"message": "Vehicle created", "vehicle_id": vehicle.id}), 201

# PUT update an existing vehicle
@vehicle_bp.route('/<int:id>', methods=['PUT'])
def update_vehicle(id):
    vehicle = Vehicle.query.get(id)
    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    data = request.get_json()
    vehicle.vehicle_type = data.get('vehicle_type', vehicle.vehicle_type)
    vehicle.plate_number = data.get('plate_number', vehicle.plate_number)
    vehicle.staff_id = data.get('staff_id', vehicle.staff_id)
    vehicle.status = data.get('status', vehicle.status)
    vehicle.description = data.get('description', vehicle.description)

    db.session.commit()
    return jsonify({"message": "Vehicle updated"}), 200

# DELETE a vehicle
@vehicle_bp.route('/<int:id>', methods=['DELETE'])
def delete_vehicle(id):
    vehicle = Vehicle.query.get(id)
    if not vehicle:
        return jsonify({"message": "Vehicle not found"}), 404

    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({"message": "Vehicle deleted"}), 200
