from flask import Blueprint, request, jsonify, redirect, url_for
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash
from app.models.admin_user_model import AdminUser as User
from app.extensions import db

user_bp = Blueprint('user_bp', __name__, url_prefix="/api/v1/users")

# JWT Configuration
JWT_SECRET_KEY = "your_very_secure_secret_key_here"  # Store this in environment variables

# Login endpoint
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Email and password are required"}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Invalid credentials"}), 401
    
    # Create JWT token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "contact": user.contact,
            "email": user.email,
            "address": user.address,
            "role": user.role,
            "description": user.description
        }
    }), 200

# Protected route example
@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "contact": user.contact,
        "email": user.email,
        "address": user.address,
        "role": user.role,
        "description": user.description
    }), 200