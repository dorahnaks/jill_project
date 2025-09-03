import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CateringEventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/catering-events/${id}`)
      .then((res) => res.json())
      .then(setEvent)
      .catch(console.error);
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p>{event.description}</p>
    </div>
  );
};

export default CateringEventDetail;
