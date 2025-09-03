import React, { useState } from "react";
import "./CheckoutPage.css";
import { useCart } from "../context/CartContext";


export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Format UGX prices
  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if ((paymentMethod === "airtel" || paymentMethod === "mtn") && !phoneNumber) {
      alert("Please enter your mobile money number.");
      return;
    }

    if (paymentMethod === "cash") {
      alert("Order confirmed! You will pay on delivery.");
      clearCart();
      return;
    }

    // Mobile money payment flow
    try {
      setLoading(true);

      // Placeholder API URL — replace with your backend endpoint later
      const res = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          phone: phoneNumber,
          method: paymentMethod,
          items: cartItems,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Payment request sent! Transaction ID: ${data.transactionId || "N/A"}`);
        clearCart();
      } else {
        alert(`Payment failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {cartItems.length > 0 ? (
        <>
          <table className="checkout-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity || 1}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{formatPrice((item.price || 0) * (item.quantity || 1))}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="3">Total</td>
                <td>{formatPrice(total)}</td>
              </tr>
            </tbody>
          </table>

          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="airtel"
                checked={paymentMethod === "airtel"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Airtel Money
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="mtn"
                checked={paymentMethod === "mtn"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              MTN Mobile Money
            </label>
          </div>

          {(paymentMethod === "airtel" || paymentMethod === "mtn") && (
            <input
              type="tel"
              placeholder="Enter Mobile Money Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-input"
            />
          )}

          <button
            className="payment-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}
    </div>
  );
}
