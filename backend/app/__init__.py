import os
import logging
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from app.extensions import db, migrate, jwt
from app.models import *

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    
    # Register blueprints
    from app.controllers.auth.auth_controller import auth_bp 
    from app.controllers.user_controller import user_bp
    from app.controllers.customer_controllers import customer_bp
    from app.controllers.catering_event_controller import catering_event_bp
    from app.controllers.delivery_controller import delivery_bp
    from app.controllers.menu_item_controller import menu_item_bp
    from app.controllers.order_controller import order_bp
    from app.controllers.order_item_controller import order_item_bp
    from app.controllers.service_controller import service_bp
    from app.controllers.gallery_controller import gallery_bp
    from app.controllers.contact_controller import contact_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(catering_event_bp)
    app.register_blueprint(delivery_bp)
    app.register_blueprint(menu_item_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(order_item_bp)
    app.register_blueprint(service_bp)
    app.register_blueprint(gallery_bp)
    app.register_blueprint(contact_bp)
    
    # Serve static files including services images
    @app.route('/static/<path:filename>')
    def serve_static(filename):
        return send_from_directory('app/static', filename)
    
    # Health check
    @app.route('/')
    def index():
        return '<h1>Welcome To Jesus Is Lord Eatery API</h1>'
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        logger.error(f"404 error: {error}")
        return jsonify({"message": "Resource not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"500 error: {error}")
        return jsonify({"message": "Internal server error"}), 500
    
    with app.app_context():
        try:
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {str(e)}", exc_info=True)
    
    return app