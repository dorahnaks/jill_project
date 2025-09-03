// src/pages/MoreServices.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MoreServices.css";

const API_BASE_URL = "/api/v1/services"; // Your Flask backend endpoint

export default function MoreServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="more-services-container">
      <h1>More Services</h1>
      <p>
        At JESUS IS LORD EATERY AND CATERING SERVICES, we go beyond food and furniture.
        Our extended services ensure your events are memorable, well-coordinated, and stress-free.
      </p>

      {loading ? (
        <p>Loading services...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : services.length > 0 ? (
        <ul className="more-services-list">
          {services.map((service) => (
            <li key={service.slug}>{service.title}</li>
          ))}
        </ul>
      ) : (
        <p>No additional services found.</p>
      )}

      <p>
        We are constantly expanding our service offerings to better serve our clients.
        If you have a special request or a unique event idea, feel free to contact us!
      </p>

      <Link to="/services" className="btn-back">← Back to Services</Link>
    </div>
  );
}
