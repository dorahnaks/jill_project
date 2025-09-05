from flask import Blueprint, request, jsonify
from app.models.customer_model import Customer
from app.extensions import db, bcrypt
from app.status_codes import (
    HTTP_400_BAD_REQUEST,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_201_CREATED, HTTP_200_OK, HTTP_404_NOT_FOUND
)
import re


customer_bp = Blueprint('customer', __name__, url_prefix='/api/v1/customer')

def is_valid_email(email):
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(regex, email)

@customer_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No input data provided'}), HTTP_400_BAD_REQUEST
    
    full_name = data.get('full_name')
    contact = data.get('contact')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    customer_type = data.get('customer_type')
    biography = data.get('biography', '')
    
    # Required fields validation
    if not full_name or not contact or not email or not password or not address or not customer_type:
        return jsonify({'error': 'All fields are required'}), HTTP_400_BAD_REQUEST
    
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), HTTP_400_BAD_REQUEST
    
    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email address'}), HTTP_400_BAD_REQUEST
    
    if Customer.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), HTTP_409_CONFLICT
    
    if Customer.query.filter_by(contact=contact).first():
        return jsonify({'error': 'Contact already in use'}), HTTP_409_CONFLICT
    
    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        customer = Customer(
            full_name=full_name,
            contact=contact,
            email=email,
            password=hashed_password,
            address=address,
            customer_type=customer_type,
            biography=biography
        )
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({
            'message': f'{full_name} has been registered successfully',
            'customer': {
                'id': customer.id,
                'full_name': customer.full_name,
                'contact': customer.contact,
                'email': customer.email,
                'address': customer.address,
                'customer_type': customer.customer_type,
                'biography': customer.biography
            }
        }), HTTP_201_CREATED
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

@customer_bp.route('/', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    customer_data = [
        {
            "id": customer.id,
            "full_name": customer.full_name,
            "contact": customer.contact,
            "email": customer.email,
            "address": customer.address,
            "customer_type": customer.customer_type,
            "biography": customer.biography
        } for customer in customers
    ]
    return jsonify(customer_data), HTTP_200_OK

@customer_bp.route('/<int:id>', methods=['GET'])
def get_customer(id):
    customer = Customer.query.get(id)
    if customer is None:
        return jsonify({"message": "Customer not found"}), HTTP_404_NOT_FOUND
    return jsonify({
        "id": customer.id,
        "full_name": customer.full_name,
        "contact": customer.contact,
        "email": customer.email,
        "address": customer.address,
        "customer_type": customer.customer_type,
        "biography": customer.biography
    }), HTTP_200_OK

@customer_bp.route('/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get(id)
    if customer is None:
        return jsonify({"message": "Customer not found"}), HTTP_404_NOT_FOUND
    
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST
    
    try:
        customer.full_name = data.get('full_name', customer.full_name)
        customer.contact = data.get('contact', customer.contact)
        customer.email = data.get('email', customer.email)
        customer.address = data.get('address', customer.address)
        customer.customer_type = data.get('customer_type', customer.customer_type)
        customer.biography = data.get('biography', customer.biography)
        
        db.session.commit()
        return jsonify({
            "message": "Customer updated successfully",
            "customer": {
                "id": customer.id,
                "full_name": customer.full_name,
                "contact": customer.contact,
                "email": customer.email,
                "address": customer.address,
                "customer_type": customer.customer_type,
                "biography": customer.biography
            }
        }), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR