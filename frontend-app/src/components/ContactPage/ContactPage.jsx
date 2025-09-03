// src/pages/ContactPage.jsx
import React, { useState } from "react";
import "./ContactPage.css";

const API_BASE_URL = "/api/v1/contact";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      service_type: e.target.service_type.value,
      message: e.target.message.value,
    };

    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit");

      setSuccessMsg("Message submitted successfully!");
      e.target.reset();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="left-panel">
        <h1>Don't Hesitate to Contact Us<br />If You Need Any Help.</h1>
        <p>If you have queries or questions, please contact us using the form or reach out directly.</p>

        <div className="contact-info">
          <p><strong>Address:</strong> Nabunya Road-Rubaga</p>
          <p><strong>Phone:</strong> +234 703 123 4567</p>
          <p><strong>Email:</strong> support@jileatery.com</p>
          <p><strong>Office Hours:</strong> Mon - Fri: 9am - 6pm</p>
        </div>
      </div>

      <div className="right-panel">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Name*" required />
          <input name="email" type="email" placeholder="Email*" required />
          <input name="phone" type="tel" placeholder="Phone Number" />
          <select name="service_type" required>
            <option value="">Type of Service</option>
            <option value="catering">Catering</option>
            <option value="delivery">Delivery</option>
            <option value="other">Other</option>
          </select>
          <textarea name="message" placeholder="Message*" required></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>

          {successMsg && <p className="success-text">{successMsg}</p>}
          {errorMsg && <p className="error-text">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
