# app/controllers/order_item_controller.py

from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.order_item_model import OrderItem
from app.models.menu_item_model import MenuItem
from app.models.order_model import Order
from app.status_codes import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
)

order_item_bp = Blueprint('order_item', __name__, url_prefix='/api/v1/order-items')

# GET all order items
@order_item_bp.route('/', methods=['GET'])
def get_all_order_items():
    items = OrderItem.query.all()
    return jsonify([{
        "id": item.id,
        "order_id": item.order_id,
        "menu_item_id": item.menu_item_id,
        "quantity": item.quantity,
        "subtotal": float(item.subtotal)
    } for item in items]), HTTP_200_OK

# GET one order item by ID
@order_item_bp.route('/<int:id>', methods=['GET'])
def get_order_item(id):
    item = OrderItem.query.get(id)
    if not item:
        return jsonify({"message": "Order item not found"}), HTTP_404_NOT_FOUND

    return jsonify({
        "id": item.id,
        "order_id": item.order_id,
        "menu_item_id": item.menu_item_id,
        "quantity": item.quantity,
        "subtotal": float(item.subtotal)
    }), HTTP_200_OK

# CREATE a new order item
@order_item_bp.route('/create', methods=['POST'])
def create_order_item():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    order_id = data.get('order_id')
    menu_item_id = data.get('menu_item_id')
    quantity = data.get('quantity')

    if not order_id or not menu_item_id or not quantity:
        return jsonify({"message": "Missing required fields"}), HTTP_400_BAD_REQUEST

    # Validate existence of menu item and order
    order = Order.query.get(order_id)
    menu_item = MenuItem.query.get(menu_item_id)

    if not order:
        return jsonify({"error": "Invalid order_id: order does not exist"}), HTTP_400_BAD_REQUEST
    if not menu_item:
        return jsonify({"error": "Invalid menu_item_id: menu item does not exist"}), HTTP_400_BAD_REQUEST

    subtotal = float(menu_item.price) * int(quantity)

    try:
        new_item = OrderItem(
            order_id=order_id,
            menu_item_id=menu_item_id,
            quantity=quantity,
            subtotal=subtotal
        )
        db.session.add(new_item)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to create order item", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

    return jsonify({
        "message": "Order item created successfully",
        "order_item": {
            "id": new_item.id,
            "order_id": new_item.order_id,
            "menu_item_id": new_item.menu_item_id,
            "quantity": new_item.quantity,
            "subtotal": float(new_item.subtotal)
        }
    }), HTTP_201_CREATED


# UPDATE an existing order item
@order_item_bp.route('/<int:id>', methods=['PUT'])
def update_order_item(id):
    item = OrderItem.query.get(id)
    if not item:
        return jsonify({"message": "Order item not found"}), HTTP_404_NOT_FOUND

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    new_quantity = data.get('quantity', item.quantity)
    new_menu_item_id = data.get('menu_item_id', item.menu_item_id)

    # Fetch new or current menu item
    menu_item = MenuItem.query.get(new_menu_item_id)
    if not menu_item:
        return jsonify({"error": "Invalid menu_item_id: menu item does not exist"}), HTTP_400_BAD_REQUEST

    item.menu_item_id = new_menu_item_id
    item.quantity = new_quantity
    item.subtotal = float(menu_item.price) * int(new_quantity)

    try:
        db.session.commit()
        return jsonify({
            "message": "Order item updated successfully",
            "order_item": {
                "id": item.id,
                "order_id": item.order_id,
                "menu_item_id": item.menu_item_id,
                "quantity": item.quantity,
                "subtotal": float(item.subtotal)
            }
        }), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update order item", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


# DELETE an order item
@order_item_bp.route('/<int:id>', methods=['DELETE'])
def delete_order_item(id):
    item = OrderItem.query.get(id)
    if not item:
        return jsonify({"message": "Order item not found"}), HTTP_404_NOT_FOUND

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Order item deleted successfully"}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete order item", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR
