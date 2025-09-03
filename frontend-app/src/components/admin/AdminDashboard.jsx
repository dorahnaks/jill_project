import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main className="admin-main-content" style={{ flex: 1, padding: "1.5rem", backgroundColor: "#f9f9f9" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
