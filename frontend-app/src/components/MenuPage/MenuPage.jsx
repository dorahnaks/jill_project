// src/pages/MenuPage.js
import React, { useEffect, useState } from "react";
import meal1 from "../../assets/meal1.jpg";
import meal2 from "../../assets/meal2.jpg";
import meal3 from "../../assets/meal3.jpg";
import meal4 from "../../assets/meal4.jpg";
import meal5 from "../../assets/meal5.jpg";
import meal6 from "../../assets/meal6.jpg";
import meal7 from "../../assets/meal7.jpg";
import meal8 from "../../assets/meal8.jpg";
import API from "../../utils/api"; // Import the API utility
import './MenuPage.css';

const imageMap = {
  "meal1.jpg": meal1,
  "meal2.jpg": meal2,
  "meal3.jpg": meal3,
  "meal4.jpg": meal4,
  "meal5.jpg": meal5,
  "meal6.jpg": meal6,
  "meal7.jpg": meal7,
  "meal8.jpg": meal8,
};

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log("Fetching menu items...");
        
        // Using the API utility
        const response = await API.get('/v1/menu-items/');
        
        console.log("API Response:", response);
        console.log("Response data:", response.data);
        
        if (Array.isArray(response.data)) {
          setMenuItems(response.data);
        } else {
          throw new Error(`Unexpected API response format: expected array, got ${typeof response.data}`);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        
        // Enhanced error handling
        let errorMessage = "Failed to fetch menu items";
        let debugData = {};
        
        if (err.response) {
          // Server responded with error status
          errorMessage = `Server error: ${err.response.status} - ${err.response.data.error || err.response.data.message}`;
          debugData = {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          };
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = "Network error - no response from server";
          debugData = {
            request: err.request,
            message: err.message
          };
        } else {
          // Error in request setup
          errorMessage = `Request setup error: ${err.message}`;
          debugData = {
            message: err.message,
            config: err.config
          };
        }
        
        setError(errorMessage);
        setDebugInfo(debugData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, []);

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading menu...</p>
    </div>
  );

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      
      {error && (
        <div className="error-container">
          <h3>Error fetching menu:</h3>
          <p>{error}</p>
          
          {Object.keys(debugInfo).length > 0 && (
            <div>
              <h4>Debug Information:</h4>
              <details style={{ marginTop: "10px" }}>
                <summary style={{ cursor: "pointer", color: "#0066cc" }}>
                  View Technical Details
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  textAlign: 'left',
                  backgroundColor: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "3px",
                  marginTop: "10px"
                }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          <div style={{ marginTop: "15px" }}>
            <h4>Troubleshooting Steps:</h4>
            <ol>
              <li>Check if your Flask backend is running on port 5000</li>
              <li>Verify the database is properly initialized</li>
              <li>Try populating the menu items: 
                <code style={{ background: "#eee", padding: "2px 4px" }}>
                  curl -X POST http://localhost:5000/api/v1/menu-items/populate
                </code>
              </li>
              <li>Check Flask logs for error messages</li>
            </ol>
          </div>
        </div>
      )}

      {Object.keys(groupedItems).length > 0 ? (
        Object.keys(groupedItems).map((category) => (
          <div key={category} className="category-section" data-category={category}>
            <h2>{category}</h2>
            <div className="menu-grid">
              {groupedItems[category].map((item) => (
                <div key={item.id} className="menu-card">
                  <img
                    src={imageMap[item.image_key] || meal1}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = meal1;
                    }}
                  />
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="price">UGX {item.price.toLocaleString()}</div>
                  <button className="order-button">Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="category-section">
          <h2>Sample Menu</h2>
          <div className="menu-grid">
            <div className="menu-card">
              <img src={meal1} alt="Sample Burger" />
              <h3>Sample Burger</h3>
              <p>Yummy burger</p>
              <div className="price">UGX 15,000</div>
              <button className="order-button">Add to Cart</button>
            </div>
            <div className="menu-card">
              <img src={meal2} alt="Sample Pizza" />
              <h3>Sample Pizza</h3>
              <p>Cheesy pizza</p>
              <div className="price">UGX 25,000</div>
              <button className="order-button">Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;