import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import "./admin.css";

const API_BASE_URL = "http://localhost:5000/api/v1/menu-items";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  // Fetch menu items from backend
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Add item to cart
  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image_url, // map backend field
    });
    alert(`${item.name} added to cart!`);
  };

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="menu-page">
      <h1>Menu</h1>
      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <img
                src={item.image_url}
                alt={item.name}
                onError={(e) => (e.target.src = "/fallback-image.jpg")}
              />
              <h3>{item.name}</h3>
              <p>Price: UGX {item.price.toLocaleString()}</p>
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No menu items found.</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
