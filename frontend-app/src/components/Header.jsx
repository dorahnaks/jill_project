import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";
import { FaUserShield } from "react-icons/fa"; //Admin icon

const Header = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <img src={logo} alt="JIL Logo" className="logo" />

      <div className="center-section">
        <nav className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>

      <div className="right-section">
        <Link to="/cart" className="cart-link">
          <span className="cart-icon" role="img" aria-label="cart">🛒</span>
          <span className="cart-count">{cartItems ? cartItems.length : 0}</span>
        </Link>

        {/* Admin Icon */}
        <Link to="/admin/login" className="admin-icon" title="Admin Login">
          <FaUserShield size={24} />
        </Link>

        <button className="login-button" onClick={handleLoginClick}>
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
