import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0, // No decimal places for UGX
    }).format(amount || 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>Price: {formatPrice(item.price)}</p>
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: {formatPrice(getTotalPrice())}</h3>
            <button className="clear-button" onClick={clearCart}>
              Clear Cart
            </button>
            <button
              className="checkout-button"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
