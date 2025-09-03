// src/components/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import logo from "../../assets/logo.png"; // adjust the path if needed

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", { email: formData.email });
      await new Promise((res) => setTimeout(res, 1000)); // simulate API delay

      if (
        formData.email === "whitneyjosephin042@gmail.com" &&
        formData.password === "@whitony143"
      ) {
        navigate("/admin");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Logo on top */}
      <div className="admin-logo">
        <img src={logo} alt="JIL Logo" />
      </div>

      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={!formData.email || !formData.password || loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
