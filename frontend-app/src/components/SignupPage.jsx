import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    contact: "",
    description: "",
    address: "",           // Added address field
    customer_type: "individual"  // Added customer_type field with default
  });
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Basic validation
    if (!formData.full_name.trim()) {
      setError("Please enter your full name");
      return;
    }
    
    if (!formData.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!formData.password.trim()) {
      setError("Please create a password");
      return;
    }
    
    if (!formData.contact.trim()) {
      setError("Please enter your contact number");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("Please enter a brief description");
      return;
    }
    
    if (!formData.address.trim()) {
      setError("Please enter your address");
      return;
    }
    
    if (!formData.customer_type.trim()) {
      setError("Please select your account type");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = "/api/v1/customer/register";
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        contact: formData.contact,
        description: formData.description,
        address: formData.address,
        customer_type: formData.customer_type
      };

      const response = await axios.post(`http://localhost:5000${endpoint}`, userData);
      
      // Store tokens
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      
      // Navigate to home page
      navigate("/");
      
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join our community today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-box">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contact">Contact Number</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="Enter your phone number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="customer_type">Account Type</label>
            <select
              id="customer_type"
              name="customer_type"
              value={formData.customer_type}
              onChange={handleChange}
              required
            >
              <option value="">Select account type</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Brief Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us about yourself"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`btn-signup ${isSubmitting ? 'loading' : ''}`}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        
        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;