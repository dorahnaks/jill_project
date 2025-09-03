from flask import Blueprint, request, jsonify, current_app
from app.models.menu_item_model import MenuItem
from app.extensions import db
from app.status_codes import (
    HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND,
    HTTP_201_CREATED, HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
)
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

menu_item_bp = Blueprint('menu_item', __name__, url_prefix='/api/v1/menu-items')

# Helper to serialize
def serialize_item(item):
    return {
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "price": float(item.price),
        "category": item.category,
        "available": item.available,
        "image_key": item.image_key or "meal1.jpg"
    }

# Populate default menu items if none exist
@menu_item_bp.route('/populate', methods=['POST'])
def populate_menu_items():
    default_items = [
        # BREAKFAST
        {"name": "Orange Juice", "price": 5000, "category": "BREAKFAST", "description": "Freshly squeezed orange juice", "image_key": "meal1.jpg"},
        {"name": "Pineapple Juice", "price": 5000, "category": "BREAKFAST", "description": "Fresh pineapple juice", "image_key": "meal2.jpg"},
        {"name": "Tea and Bread", "price": 4000, "category": "BREAKFAST", "description": "Hot tea with fresh bread", "image_key": "meal3.jpg"},
        # MEALS
        {"name": "Fried Rice", "price": 15000, "category": "MEALS", "description": "Delicious fried rice", "image_key": "meal4.jpg"},
        {"name": "Jollof Rice", "price": 15000, "category": "MEALS", "description": "Classic Jollof Rice", "image_key": "meal5.jpg"},
        {"name": "White Rice & Stew", "price": 15000, "category": "MEALS", "description": "Rice served with stew", "image_key": "meal6.jpg"},
        {"name": "Meal 1", "price": 18000, "category": "MEALS", "description": "Tasty meal", "image_key": "meal7.jpg"},
        {"name": "Meal 2", "price": 18000, "category": "MEALS", "description": "Special meal", "image_key": "meal8.jpg"},
        # SNACKS
        {"name": "Puff Puff", "price": 3000, "category": "SNACKS", "description": "Sweet fried dough", "image_key": "meal1.jpg"},
        {"name": "Meat Pie", "price": 4000, "category": "SNACKS", "description": "Savory meat pie", "image_key": "meal2.jpg"},
        # DRINKS
        {"name": "Fruit Drink", "price": 4000, "category": "DRINKS", "description": "Refreshing fruit drink", "image_key": "meal3.jpg"},
        {"name": "Water", "price": 2000, "category": "DRINKS", "description": "Bottled water", "image_key": "meal4.jpg"},
        # VEGETABLES
        {"name": "Vegetable 1", "price": 8000, "category": "VEGETABLES", "description": "Healthy vegetable dish", "image_key": "meal5.jpg"},
        {"name": "Vegetable 2", "price": 8000, "category": "VEGETABLES", "description": "Fresh vegetables", "image_key": "meal6.jpg"},
    ]

    try:
        for item in default_items:
            # Check if item already exists by name
            exists = MenuItem.query.filter_by(name=item["name"]).first()
            if not exists:
                menu_item = MenuItem(
                    name=item["name"],
                    category=item["category"],
                    price=item["price"],
                    description=item.get("description", ""),
                    available=True,
                    image_key=item.get("image_key")
                )
                db.session.add(menu_item)
        db.session.commit()
        return jsonify({"message": "Default menu items populated successfully"}), HTTP_201_CREATED
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error populating menu items: {str(e)}", exc_info=True)
        return jsonify({"message": "Failed to populate menu items", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# GET all menu items - FIXED: Enhanced error handling
@menu_item_bp.route('', methods=['GET'], strict_slashes=False)
def get_all_menu_items():
    try:
        logger.debug("Attempting to fetch all menu items")
        items = MenuItem.query.all()
        logger.debug(f"Found {len(items)} menu items")
        return jsonify([serialize_item(item) for item in items]), HTTP_200_OK
    except Exception as e:
        logger.error(f"Error fetching menu items: {str(e)}", exc_info=True)
        return jsonify({"message": "Error fetching menu items", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# GET one item
@menu_item_bp.route('/<int:id>', methods=['GET'])
def get_menu_item(id):
    try:
        item = MenuItem.query.get(id)
        if not item:
            return jsonify({"message": "Menu item not found"}), HTTP_404_NOT_FOUND
        return jsonify(serialize_item(item)), HTTP_200_OK
    except Exception as e:
        logger.error(f"Error fetching menu item {id}: {str(e)}", exc_info=True)
        return jsonify({"message": "Error fetching menu item", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# POST new
@menu_item_bp.route('/create', methods=['POST'])
def create_menu_item():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST
    try:
        new_item = MenuItem(
            name=data['name'],
            price=data['price'],
            category=data['category'],
            description=data.get('description', ''),
            available=data.get('available', True),
            image_key=data.get('image_key', 'meal1.jpg')
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Menu item created", "menu_item": serialize_item(new_item)}), HTTP_201_CREATED
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating menu item: {str(e)}", exc_info=True)
        return jsonify({"message": "Failed to create menu item", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# PUT update
@menu_item_bp.route('/<int:id>', methods=['PUT'])
def update_menu_item(id):
    try:
        item = MenuItem.query.get(id)
        if not item:
            return jsonify({"message": "Menu item not found"}), HTTP_404_NOT_FOUND
        data = request.get_json()
        item.name = data.get('name', item.name)
        item.price = data.get('price', item.price)
        item.category = data.get('category', item.category)
        item.description = data.get('description', item.description)
        item.available = data.get('available', item.available)
        item.image_key = data.get('image_key', item.image_key)
        db.session.commit()
        return jsonify({"message": "Menu item updated", "menu_item": serialize_item(item)}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating menu item {id}: {str(e)}", exc_info=True)
        return jsonify({"message": "Failed to update menu item", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR

# DELETE
@menu_item_bp.route('/<int:id>', methods=['DELETE'])
def delete_menu_item(id):
    try:
        item = MenuItem.query.get(id)
        if not item:
            return jsonify({"message": "Menu item not found"}), HTTP_404_NOT_FOUND
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Deleted successfully"}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting menu item {id}: {str(e)}", exc_info=True)
        return jsonify({"message": "Failed to delete menu item", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR