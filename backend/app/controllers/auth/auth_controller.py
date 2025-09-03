from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.models.order_model import Order
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_409_CONFLICT, HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_201_CREATED, HTTP_200_OK, HTTP_401_UNAUTHORIZED
)
import validators
import json
from app.models.user_model import User
from app.models.customer_model import Customer
from app.models.staff_model import Staff
from app.extensions import db, bcrypt
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required, get_jwt_identity
)

auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')


# User Registration 
@auth.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), HTTP_400_BAD_REQUEST

    full_name = data.get('full_name')
    email = data.get('email')
    contact = data.get('contact')
    password = data.get('password')
    description = data.get('description')
    address = data.get('address')
    role = data.get('role', 'staff')

    if not full_name or not email or not contact or not password or not description:
        return jsonify({'error': 'All required fields must be provided: full_name, email, contact, password, description'}), HTTP_400_BAD_REQUEST

    if not validators.email(email):
        return jsonify({'error': 'Invalid email format'}), HTTP_400_BAD_REQUEST

    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), HTTP_409_CONFLICT
    if User.query.filter_by(contact=contact).first():
        return jsonify({'error': 'Contact already in use'}), HTTP_409_CONFLICT

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        full_name=full_name,
        email=email,
        contact=contact,
        address=address,
        description=description,
        password=hashed_password,
        role=role
    )

    try:
        db.session.add(new_user)
        db.session.commit()

        identity = json.dumps({'role': role, 'id': new_user.id})
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)

        return jsonify({
            'message': f'{new_user.full_name} registered successfully',
            'user': {
                'id': new_user.id,
                'full_name': new_user.full_name,
                'email': new_user.email,
                'contact': new_user.contact,
                'description': new_user.description
            },
            'access_token': access_token,
            'refresh_token': refresh_token
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        print(f"Error during registration: {e}")
        return jsonify({'error': 'Something went wrong during registration'}), HTTP_500_INTERNAL_SERVER_ERROR


# User Login (Staff/Admin)
@auth.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    print(f"Login attempt: email={email}, password={'*' * len(password) if password else None}")

    user = User.query.filter_by(email=email).first()
    if user:
        print(f"User found: email={user.email}")
        print(f"Password hash: {user.password}")
        pw_match = bcrypt.check_password_hash(user.password, password)
        print(f"Password match: {pw_match}")
    else:
        print("User not found")

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), HTTP_401_UNAUTHORIZED

    identity = json.dumps({'role': user.role, 'id': user.id})
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


# Customer Login (separate route to avoid conflict)
@auth.route('/customer-login', methods=['POST'])
def login_customer():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    print(f"Customer Login attempt: email={email}, password={'*' * len(password) if password else None}")

    customer = Customer.query.filter_by(email=email).first()
    if customer:
        print(f"Customer found: email={customer.email}")
        print(f"Password hash: {customer.password}")
        pw_match = bcrypt.check_password_hash(customer.password, password)
        print(f"Password match: {pw_match}")
    else:
        print("Customer not found")

    if not customer or not bcrypt.check_password_hash(customer.password, password):
        return jsonify({'error': 'Invalid email or password'}), HTTP_401_UNAUTHORIZED

    identity = json.dumps({'role': 'customer', 'id': customer.id})
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
