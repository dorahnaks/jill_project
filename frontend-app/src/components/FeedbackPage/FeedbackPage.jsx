import React, { useState } from "react";
import "./FeedbackPage.css";

const FeedbackPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks, ${name}! Your feedback has been received.`);
    setName("");
    setEmail("");
    setRating(5);
    setFeedback("");
  };

  return (
    <div className="feedback-page">
      <h2>We Value Your Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Your Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        >
          <option value="">Rate Us (1-5)</option>
          <option value="1">⭐ 1 - Poor</option>
          <option value="2">⭐ 2 - Fair</option>
          <option value="3">⭐ 3 - Good</option>
          <option value="4">⭐ 4 - Very Good</option>
          <option value="5">⭐ 5 - Excellent</option>
        </select>

        <textarea
          placeholder="Your Feedback"
          value={feedback}
          required
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackPage;
