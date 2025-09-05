import React from 'react';
import Sidebar from './Sidebar';  
import DashboardHome from './Dashboardlayout'; // Import the dashboard home component
import './admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div className="dashboard-content" style={{ padding: '2rem', backgroundColor: '#f9f9f9ff' }}>
        <DashboardHome /> {/* Render the dashboard home content */}
      </div>
    </div>
  );
};

export default AdminDashboard;