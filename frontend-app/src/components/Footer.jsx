import React from 'react';
import './Footer.css';
import { FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa'; // social icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Visit Us */}
        <div className="footer-column">
          <h4>VISIT US</h4>
          <p>
            Jesus Is Lord <br />
            Eatery And Catering Services<br />
            Opposite Miracle Center<br />
            Nabunya Road
          </p>
          <p>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Nabunya+Road" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </p>
        </div>

        {/* Follow Us */}
        <div className="footer-column">
          <h4>FOLLOW US</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
          </div>
        </div>

        {/* Organisation */}
        <div className="footer-column">
          <h4>OUR ORGANISATION</h4>
          <p>
            JESUS IS LORD<br />
            EATERY AND CATERING SERVICES
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>TERMS OF USE &nbsp; | &nbsp; PRIVACY POLICY &nbsp; | &nbsp; CONTACT US</p>
        <p>©2025 Jesus Is Lord Eatery And Catering Services</p>
      </div>
    </footer>
  );
};

export default Footer;
