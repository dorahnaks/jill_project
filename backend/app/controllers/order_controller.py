from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order_model import Order
from app.models.customer_model import Customer
from app.models.admin_user_model import AdminUser as User
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
)
from datetime import datetime

order_bp = Blueprint('order', __name__, url_prefix='/api/v1/orders')

# GET all orders
@order_bp.route('/', methods=['GET'])
def get_all_orders():
    orders = Order.query.all()
    result = []

    for o in orders:
        result.append({
            "id": o.id,
            "customer_id": o.customer_id,
            "user_id": o.user_id,
            "order_date": o.order_date.isoformat(),
            "total_amount": str(o.total_amount),
            "payment_status": o.payment_status,
            "delivery_status": o.delivery_status,
            "description": o.description
        })

    return jsonify(result), HTTP_200_OK


# GET one order
@order_bp.route('/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"message": "Order not found"}), HTTP_404_NOT_FOUND

    return jsonify({
        "id": order.id,
        "customer_id": order.customer_id,
        "user_id": order.user_id,
        "order_date": order.order_date.isoformat(),
        "total_amount": str(order.total_amount),
        "payment_status": order.payment_status,
        "delivery_status": order.delivery_status,
        "description": order.description
    }), HTTP_200_OK


# CREATE a new order
@order_bp.route('/create', methods=['POST'])
def create_order():
    data = request.get_json()

    required_fields = [
        'customer_id', 'total_amount',
        'payment_status', 'delivery_status'
    ]
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing field: {field}"}), HTTP_400_BAD_REQUEST

    # Validate foreign keys
    if not Customer.query.get(data['customer_id']):
        return jsonify({"message": "Invalid customer_id"}), HTTP_404_NOT_FOUND

    if data.get('user_id') and not User.query.get(data['user_id']):
        return jsonify({"message": "Invalid user_id"}), HTTP_404_NOT_FOUND

    try:
        new_order = Order(
            customer_id=data['customer_id'],
            user_id=data.get('user_id'),
            total_amount=data['total_amount'],
            payment_status=data['payment_status'],
            delivery_status=data['delivery_status'],
            description=data.get('description')
        )

        db.session.add(new_order)
        db.session.commit()

        return jsonify({
            "message": "Order created successfully",
            "order": {
                "id": new_order.id,
                "customer_id": new_order.customer_id,
                "user_id": new_order.user_id,
                "order_date": new_order.order_date.isoformat(),
                "total_amount": str(new_order.total_amount),
                "payment_status": new_order.payment_status,
                "delivery_status": new_order.delivery_status,
                "description": new_order.description
            }
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create order", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# UPDATE an order
@order_bp.route('/<int:id>', methods=['PUT'])
def update_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"message": "Order not found"}), HTTP_404_NOT_FOUND

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    order.customer_id = data.get('customer_id', order.customer_id)
    order.user_id = data.get('user_id', order.user_id)
    order.total_amount = data.get('total_amount', order.total_amount)
    order.payment_status = data.get('payment_status', order.payment_status)
    order.delivery_status = data.get('delivery_status', order.delivery_status)
    order.description = data.get('description', order.description)

    try:
        db.session.commit()
        return jsonify({"message": "Order updated successfully"}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update order", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# DELETE an order
@order_bp.route('/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({"message": "Order not found"}), HTTP_404_NOT_FOUND

    try:
        db.session.delete(order)
        db.session.commit()
        return jsonify({"message": "Order deleted successfully"}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete order", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR
