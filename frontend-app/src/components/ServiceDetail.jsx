// components/ServiceDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ServiceDetail() {
  const { serviceId } = useParams(); // serviceId = slug from URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/v1/services/${serviceId}`);
        if (!response.ok) {
          throw new Error("Service not found");
        }
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Loading service...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>{error}</h2>
        <Link to="/services">← Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="service-detail" style={{ padding: "2rem" }}>
      {service?.image_url && (
        <img
          src={service.image_url}
          alt={service.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}
      <h1 style={{ marginTop: "1rem" }}>{service.title}</h1>
      <p style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>{service.description}</p>
      <Link
        to="/services"
        className="btn-learnmore"
        style={{ marginTop: "1rem", display: "inline-block" }}
      >
        ← Back to Services
      </Link>
    </div>
  );
}
