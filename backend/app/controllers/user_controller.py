from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user_model import User

user_bp = Blueprint('user_bp', __name__, url_prefix="/api/v1/users")

# Helper function to serialize a user
def serialize_user(user):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "contact": user.contact,
        "email": user.email,
        "address": user.address,
        "role": user.role,
        "description": user.description
    }

# GET all users
@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([serialize_user(user) for user in users]), 200

# GET a single user by ID
@user_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(serialize_user(user)), 200

# POST a new user
@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    required_fields = ['full_name', 'contact', 'email']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing required field: {field}"}), 400

    if "@" not in data['email']:
        return jsonify({"message": "Invalid email address"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 409

    try:
        new_user = User(
            full_name=data['full_name'],
            contact=data['contact'],
            email=data['email'],
            password=data.get('password'),
            address=data.get('address'),
            role=data.get('role', 'staff'),
            description=data.get('description', '')
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "User created successfully",
            "user": serialize_user(new_user)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

# PUT update existing user
@user_bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    try:
        user.full_name = data.get('full_name', user.full_name)
        user.contact = data.get('contact', user.contact)
        user.email = data.get('email', user.email)
        user.address = data.get('address', user.address)
        user.role = data.get('role', user.role)
        user.description = data.get('description', user.description)

        db.session.commit()

        return jsonify({
            "message": "User updated successfully",
            "user": serialize_user(user)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500

# DELETE a user by ID
@user_bp.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
