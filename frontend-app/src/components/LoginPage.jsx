import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError("");
    
    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to login endpoint
      const response = await axios.post("http://localhost:5000/api/v1/auth/login", {
        email,
        password
      });

      // Handle successful login
      const { access_token, refresh_token, user } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate to home page
      navigate("/");
      
    } catch (err) {
      // Handle errors
      console.error("Login error:", err);
      
      if (err.response) {
        setError(err.response.data.error || "Invalid email or password");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="alert-error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="login-actions">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`btn-primary ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <span className="spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>
              
              <div className="login-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            </div>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;