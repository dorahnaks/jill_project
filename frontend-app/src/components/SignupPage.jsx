import React, { useState } from "react";
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setError("");
    alert(`Signing up with\nName: ${name}\nEmail: ${email}`);
    // Replace alert with actual signup logic
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          onChange={handleChange}
          value={formData.name}
        />

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          value={formData.email}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          onChange={handleChange}
          value={formData.password}
        />

        <button type="submit">Create Account</button>
      </form>

      <div className="signup-footer">
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default SignupPage;
