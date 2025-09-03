from flask import Blueprint, request, jsonify
from app.models.catering_event_model import CateringEvent
from app.extensions import db
from app.status_codes import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_201_CREATED, HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR
from datetime import datetime

catering_event_bp = Blueprint('catering_event', __name__, url_prefix="/api/v1/catering-events")


@catering_event_bp.route('/create', methods=['POST'])
def create_event():
    data = request.get_json()
    required_fields = ['customer_id', 'event_name', 'event_date', 'location', 'number_of_guests', 'menu']

    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"message": f"Missing required fields: {', '.join(missing_fields)}"}), HTTP_400_BAD_REQUEST

    try:
        event_date = datetime.fromisoformat(data['event_date'])
    except ValueError:
        return jsonify({"message": "Invalid date format for event_date, use ISO format (YYYY-MM-DDTHH:MM:SS)"}), HTTP_400_BAD_REQUEST

    try:
        new_event = CateringEvent(
            customer_id=data['customer_id'],
            event_name=data['event_name'],
            event_date=event_date,
            location=data['location'],
            number_of_guests=int(data['number_of_guests']),
            menu=data['menu'],
            status=data.get('status', 'pending'),
            description=data.get('description')
        )
        db.session.add(new_event)
        db.session.commit()

        return jsonify({
            "message": "Catering event created successfully",
            "event": {
                "id": new_event.id,
                "customer_id": new_event.customer_id,
                "event_name": new_event.event_name,
                "event_date": new_event.event_date.isoformat(),
                "location": new_event.location,
                "number_of_guests": new_event.number_of_guests,
                "menu": new_event.menu,
                "status": new_event.status,
                "description": new_event.description
            }
        }), HTTP_201_CREATED

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating event", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


@catering_event_bp.route('/', methods=['GET'])
def get_all_events():
    events = CateringEvent.query.all()
    return jsonify([{
        "id": e.id,
        "customer_id": e.customer_id,
        "event_name": e.event_name,
        "event_date": e.event_date.isoformat(),
        "location": e.location,
        "number_of_guests": e.number_of_guests,
        "menu": e.menu,
        "status": e.status,
        "description": e.description
    } for e in events]), HTTP_200_OK


@catering_event_bp.route('/<int:id>', methods=['GET'])
def get_event_by_id(id):
    event = CateringEvent.query.get(id)
    if not event:
        return jsonify({"message": "Catering event not found"}), HTTP_404_NOT_FOUND

    return jsonify({
        "id": event.id,
        "customer_id": event.customer_id,
        "event_name": event.event_name,
        "event_date": event.event_date.isoformat(),
        "location": event.location,
        "number_of_guests": event.number_of_guests,
        "menu": event.menu,
        "status": event.status,
        "description": event.description
    }), HTTP_200_OK


@catering_event_bp.route('/<int:id>', methods=['PUT'])
def update_event(id):
    event = CateringEvent.query.get(id)
    if not event:
        return jsonify({"message": "Catering event not found"}), HTTP_404_NOT_FOUND

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), HTTP_400_BAD_REQUEST

    try:
        event.customer_id = data.get('customer_id', event.customer_id)
        event.event_name = data.get('event_name', event.event_name)

        if 'event_date' in data:
            event.event_date = datetime.fromisoformat(data['event_date'])

        event.location = data.get('location', event.location)
        event.number_of_guests = int(data.get('number_of_guests', event.number_of_guests))
        event.menu = data.get('menu', event.menu)
        event.status = data.get('status', event.status)
        event.description = data.get('description', event.description)

        db.session.commit()
        return jsonify({"message": "Catering event updated successfully"}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update event", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR


@catering_event_bp.route('/<int:id>', methods=['DELETE'])
def delete_event(id):
    event = CateringEvent.query.get(id)
    if not event:
        return jsonify({"message": "Catering event not found"}), HTTP_404_NOT_FOUND

    try:
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Catering event deleted successfully"}), HTTP_200_OK
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to delete event", "error": str(e)}), HTTP_500_INTERNAL_SERVER_ERROR
