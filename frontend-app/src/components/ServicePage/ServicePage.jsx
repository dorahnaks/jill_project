import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ServicePage.css';

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/v1/services');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="services-container">
        <h1>Our Services</h1>
        <div className="loading-spinner">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-container">
        <h1>Our Services</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="services-container">
      <h1>Our Services</h1>
      <div className="services-grid">
        {services.length > 0 ? (
          services.map((service) => (
            <div className="service-card" key={service.slug}>
              <img 
                src={service.image_url || `https://via.placeholder.com/300x200?text=${service.title.replace(/\s+/g, '+')}`} 
                alt={service.title}
                onError={(e) => e.target.src = `https://via.placeholder.com/300x200?text=${service.title.replace(/\s+/g, '+')}`}/>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to={`/services/${service.slug}`} className="btn-learnmore">
                Learn More
              </Link>
            </div>
          ))
        ) : (
          <div className="no-services">
            No services available at the moment.
          </div>
        )}
      </div>
      
      <div className="more-services">
        <p>
          For any other services offered at JESUS IS LORD EATERY AND CATERING SERVICES,
          kindly <Link to="/services/more" className="btn-clickhere">Click Here</Link>
        </p>
      </div>
    </div>
  );
};

export default ServicePage;