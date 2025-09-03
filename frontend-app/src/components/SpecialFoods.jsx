import React from "react";
import "./SpecialFoods.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import food1 from "../assets/food1.png"; 
import food4 from "../assets/food4.png";
import food3 from "../assets/food3.png";
import food5 from "../assets/food5.png";

const foodItems = [
  { name: "chips", image: food1 },
  { name: "Rollex mix", image: food4 },
  { name: "chicken beverage", image: food3 },
  { name: "Drinks", image: food5 },
];

const SpecialFoods = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <section className="special-foods">
      <h2>OUR SPECIAL FOODS</h2>
      <div className="food-grid-columns">
        {foodItems.map((item, idx) => (
          <div className="food-card" key={idx}>
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <div className="view-more-container">
        <button
          className="view-more-button"
          onClick={() => navigate("/menu")}
        >
          View More
        </button>
      </div>
    </section>
  );
};

export default SpecialFoods;
