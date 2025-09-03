import React from "react";
import { Link } from "react-router-dom";
import "./Testimonials.css";

// Import customer images
import customer1 from "../../src/assets/customer1.jpg";
import customer2 from "../../src/assets/customer2.jpg";

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2 className="testimonial-heading">What Our Customers Say</h2>

      <div className="testimonial-container">
        <div className="testimonial-box">
          <img src={customer1} alt="Customer 1" className="testimonial-img" />
          <p className="testimonial-text">"The first time i ordered from JIL's food,it was delicious and delivered on time, i always order from there"</p>
        
        </div>

        <div className="testimonial-box">
          <img src={customer2} alt="Customer 2" className="testimonial-img" />
          <p className="testimonial-text">"Affordable and varied breakfast at JIL is an ideal for a student like me"</p>
          {/* <p className="testimonial-name">- David K.</p> */}
        </div>
      </div>

      <div className="feedback-button-container">
        <Link to="/feedback">
          <button className="feedback-button">Give Us Your Feedback</button>
        </Link>
      </div>
    </section>
  );
};

export default Testimonials;
