import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider> {/* Wrap with AuthProvider first */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);