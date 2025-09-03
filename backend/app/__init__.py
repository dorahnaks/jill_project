import os
import logging
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from app.extensions import db, migrate, jwt
from app.models.user_model import User
from app.models.customer_model import Customer
from app.models.catering_event_model import CateringEvent
from app.models.delivery_model import Delivery
from app.models.order_model import Order
from app.models.menu_item_model import MenuItem
from app.models.staff_model import Staff
from app.models.vehicle_model import Vehicle

def create_app():
    # Initialize Flask application
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object('app.config.Config')
    
    # Enable CORS for all routes
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configure logging
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)

    # --- Register blueprints ---
    from app.controllers.auth.auth_controller import auth
    from app.controllers.user_controller import user_bp
    from app.controllers.customer_controllers import customer_bp
    from app.controllers.catering_event_controller import catering_event_bp
    from app.controllers.delivery_controller import delivery_bp
    from app.controllers.menu_item_controller import menu_item_bp
    from app.controllers.staff_controller import staff_bp
    from app.controllers.vehicle_controller import vehicle_bp
    from app.controllers.order_controller import order_bp
    from app.controllers.order_item_controller import order_item_bp
    from app.controllers.service_controller import service_bp
    from app.controllers.gallery_controller import gallery_bp
    from app.controllers.contact_controller import contact_bp
    
    app.register_blueprint(auth)
    app.register_blueprint(user_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(catering_event_bp)
    app.register_blueprint(delivery_bp)
    app.register_blueprint(menu_item_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(vehicle_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(order_item_bp)
    app.register_blueprint(service_bp)
    app.register_blueprint(gallery_bp)
    app.register_blueprint(contact_bp)

    # --- Serve uploads folder dynamically ---
    UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_FOLDER, filename)

    # --- Health check ---
    @app.route('/')
    def index():
        return '<h1><i>Welcome To Jesus Is Lord Eatery API</i></h1>'
    
    # --- Error handlers ---
    @app.errorhandler(404)
    def not_found(error):
        logger.error(f"404 error: {error}")
        return jsonify({"message": "Resource not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"500 error: {error}")
        return jsonify({"message": "Internal server error"}), 500
    
    # --- Create tables if they don't exist ---
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {str(e)}", exc_info=True)
    
    return app
