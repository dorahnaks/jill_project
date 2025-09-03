import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Add this
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    alert(`Logging in with\nEmail: ${email}\nPassword: ${'*'.repeat(password.length)}`);
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {error && <p className="error-message">{error}</p>}

        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <button type="submit">Login</button>
      </form>

      <div className="login-footer">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
