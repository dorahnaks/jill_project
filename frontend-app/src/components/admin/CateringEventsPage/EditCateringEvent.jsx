import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCateringEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/catering-events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch event data');
        return res.json();
      })
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Unable to load event');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/catering-events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update event');
      
      alert('Event updated successfully!');
      navigate('/admin/catering-events'); // optional redirect
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edit-event-form">
      <h2>Edit Catering Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          placeholder="Event Title"
          required
        />
        <input
          name="date"
          type="date"
          value={formData.date || ''}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Description"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
};

export default EditCateringEvent;
