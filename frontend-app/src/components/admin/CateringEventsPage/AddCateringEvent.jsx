import React, { useState } from 'react';

const AddCateringEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/catering-events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) alert('Event added successfully!');
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  return (
    <div>
      <h2>Add Catering Event</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="date" type="date" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddCateringEvent;
