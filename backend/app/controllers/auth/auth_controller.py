# app/controllers/auth_controller.py
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.models.order_model import Order
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_201_CREATED, HTTP_200_OK, HTTP_401_UNAUTHORIZED
)
import re
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity
)

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.models.admin_user_model import AdminUser
from app.models.customer_model import Customer
from app.extensions import db, bcrypt
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_201_CREATED, HTTP_200_OK, HTTP_401_UNAUTHORIZED
)
import validators
import logging
import json
from datetime import datetime

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

# Helper function for email validation
def is_valid_email(email):
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(regex, email)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), HTTP_400_BAD_REQUEST
    
    full_name = data.get('full_name')
    contact = data.get('contact')
    email = data.get('email')
    password = data.get('password')
    
    # Required fields validation
    if not full_name or not contact or not email or not password:
        return jsonify({'error': 'All required fields must be provided: full_name, contact, email, password'}), HTTP_400_BAD_REQUEST
    
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
    
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email format'}), HTTP_400_BAD_REQUEST
    
    if AdminUser.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), HTTP_409_CONFLICT
    
    if AdminUser.query.filter_by(contact=contact).first():
        return jsonify({'error': 'Contact already in use'}), HTTP_409_CONFLICT
    
    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_admin = AdminUser(
            full_name=full_name,
            contact=contact,
            email=email,
            password=hashed_password
        )
        db.session.add(new_admin)
        db.session.commit()
        
        # Create JWT identity
        identity = {'role': 'admin', 'id': new_admin.id}
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)
        
        return jsonify({
            'message': f'{full_name} has been registered successfully',
            'user': {
                'id': new_admin.id,
                'full_name': new_admin.full_name,
                'contact': new_admin.contact,
                'email': new_admin.email,
                'role': new_admin.role
            },
            'access_token': access_token,
            'refresh_token': refresh_token
        }), HTTP_201_CREATED
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error registering admin: {str(e)}")
        return jsonify({'error': 'Registration failed'}), HTTP_500_INTERNAL_SERVER_ERROR

@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), HTTP_400_BAD_REQUEST
    
    user = AdminUser.query.filter_by(email=email).first()
    
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), HTTP_401_UNAUTHORIZED
    
    # Create JWT identity
    identity = {'role': user.role, 'id': user.id}
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)
    
    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'role': user.role
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), HTTP_200_OK

@auth_bp.route('/customer-login', methods=['POST'])
def login_customer():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), HTTP_400_BAD_REQUEST
    
    customer = Customer.query.filter_by(email=email).first()
    
    if not customer or not bcrypt.check_password_hash(customer.password, password):
        return jsonify({'error': 'Invalid email or password'}), HTTP_401_UNAUTHORIZED
    
    # Create JWT identity
    identity = {'role': 'customer', 'id': customer.id}
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)
    
    return jsonify({
        'message': 'Login successful',
        'customer': {
            'id': customer.id,
            'full_name': customer.full_name,
            'email': customer.email
        },
        'access_token': access_token,
        'refresh_token': refresh_token
    }), HTTP_200_OK

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({'access_token': new_access_token}), HTTP_200_OK