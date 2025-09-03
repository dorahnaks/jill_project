import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
import heroImage from "../assets/hero-image.png";

const Hero = () => {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="hero-content">
        <h1>WELCOME TO</h1>
        <h2>JESUS IS LORD EATERY AND CATERING SERVICES</h2>

        <Link to="/menu">
          <button className="order-button">Order Now</button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
