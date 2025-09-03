// src/components/admin/OrdersPage.jsx
import React, { useEffect, useState } from 'react';
import './admin.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const API_BASE_URL = "http://localhost:5000/api/v1/orders"; 
// ⚠️ Change localhost:5000 to your backend URL

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      fetchOrders(); // refresh after deletion
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2 className="orders-title">Orders Dashboard</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer_name || "N/A"}</td>
                    <td>
                      {order.items
                        ? order.items.map((item) => item.name).join(", ")
                        : "N/A"}
                    </td>
                    <td>{order.status || "Pending"}</td>
                    <td>UGX {order.total?.toLocaleString() || "0"}</td>
                    <td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="action-buttons">
                      <button className="icon-btn update" data-label="Update">
                        <FaEdit />
                      </button>
                      <button
                        className="icon-btn delete"
                        data-label="Delete"
                        onClick={() => handleDelete(order.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-orders">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
