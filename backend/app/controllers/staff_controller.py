from operator import add
from flask import Blueprint, request, jsonify
from app.models.staff_model import Staff
from app.extensions import db, bcrypt
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_201_CREATED, HTTP_500_INTERNAL_SERVER_ERROR
)

staff_bp = Blueprint('staff_bp', __name__, url_prefix='/api/v1/staff')

@staff_bp.route('/register', methods=['POST'])
def register_staff():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST
    
    full_name = data.get('full_name')
    contact = data.get('contact')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'staff')  # default role if not provided
    description = data.get('description', '')
    hire_date = data.get('hire_date')  # consider validating date format if used
    address = data.get('address', '')  # optional field
    # created_at and updated_at will default to now in the model usually
    
    # Validate required fields
    if not full_name or not contact or not email or not password:
        return jsonify({"message": "Missing required fields"}), HTTP_400_BAD_REQUEST
    
    # Check if email already exists
    existing_staff = Staff.query.filter_by(email=email).first()
    if existing_staff:
        return jsonify({"message": "Email already registered"}), HTTP_409_CONFLICT
    
    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Create new staff instance
    new_staff = Staff(
        full_name=full_name,
        contact=contact,
        email=email,
        password=hashed_password,
        role=role,
        description=description,
        hire_date=hire_date,
        address=address
    )
    
    try:
        db.session.add(new_staff)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Internal server error", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR
    
    return jsonify({
        "message": "Staff registered successfully",
        "staff": {
            "id": new_staff.id,
            "full_name": new_staff.full_name,
            "contact": new_staff.contact,
            "email": new_staff.email,
            "role": new_staff.role,
            "description": new_staff.description,
            "hire_date": str(new_staff.hire_date),
            "address": new_staff.address
        }
    }), HTTP_201_CREATED
    
# GET a single staff by ID
@staff_bp.route('/<int:id>', methods=['GET'])
def get_staff(id):
    staff = Staff.query.get(id)
    if staff is None:
        return jsonify({"message": "Staff not found"}), 404
    return jsonify({
        "id": staff.id,
        "full_name": staff.full_name,
        "contact": staff.contact,
        "email": staff.email,
        "address": staff.address,
        "role": staff.role,
        # "customer_type": staff.customer_type,
        "description": staff.description
    }), 200

# Getting all staff members
@staff_bp.route('/', methods=['GET'])
def get_staff_members():
    staff_members = Staff.query.all()
    staff_data = [
        {
            "id": staff.id,
            "full_name": staff.full_name,
            "contact": staff.contact,
            "email": staff.email,
            "address": staff.address,
            "role": staff.role,
        } for staff in staff_members
    ]
    return jsonify(staff_data), 200

# PUT update existing staff member
@staff_bp.route('/<int:id>', methods=['PUT'])
def update_staff(id):
    staff = Staff.query.get(id)
    if staff is None:
        return jsonify({"message": "Staff not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    try:
        staff.full_name = data.get('full_name', staff.full_name)
        staff.contact = data.get('contact', staff.contact)
        staff.email = data.get('email', staff.email)
        staff.address = data.get('address', staff.address)
        # staff.customer_type = data.get('customer_type', staff.customer_type)
        staff.description = data.get('description', staff.description)
        staff.role = data.get('role', staff.role) # Update role if provided

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

    return jsonify({
        "message": "Staff updated successfully",
        "staff": {
            "id": staff.id,
            "full_name": staff.full_name,
            "contact": staff.contact,
            "email": staff.email,
            "address": staff.address,
            # "staff.customer_type": staff.customer_type,
            "description": staff.description
        }
    }), 200
