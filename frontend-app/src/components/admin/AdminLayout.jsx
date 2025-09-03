// src/components/admin/AdminLayout.jsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./admin.css"; // single CSS for admin

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-content">
        <Sidebar />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
