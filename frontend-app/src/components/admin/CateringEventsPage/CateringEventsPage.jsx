import React from 'react';
import { Link } from 'react-router-dom';

const CateringEventsPage = () => {
  const events = [
    {
      id: 1,
      name: 'Jesus Is Lord Eatery & Catering Service',
      date: '2025-08-15',
    },
  ];

  return (
    <div className="catering-event-page">
      <h2>Catering Events</h2>

      <Link to="/admin/catering-events/new" className="add-event-button">
        Add New Event
      </Link>

      <div className="event-list">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <div className="event-info">
              <strong>{event.name}</strong><br />
              <small>{event.date}</small>
            </div>

            <div className="event-actions">
              <Link to={`/admin/catering-events/${event.id}/edit`} className="edit-btn">
                Edit
              </Link>
              <Link to={`/admin/catering-events/${event.id}`} className="view-btn">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CateringEventsPage;
