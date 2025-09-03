import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { FiShoppingCart, FiUsers, FiTruck, FiBriefcase } from 'react-icons/fi';
import Sidebar from './Sidebar';  
import './admin.css';

const salesData = [
  { month: 'Jan', sales: 300 },
  { month: 'Feb', sales: 450 },
  { month: 'Mar', sales: 500 },
  { month: 'Apr', sales: 620 },
  { month: 'May', sales: 750 },
  { month: 'Jun', sales: 810 },
  { month: 'Jul', sales: 970 },
  { month: 'Aug', sales: 1100 }
];

const serviceDemandData = [
  { name: 'Catering', value: 25 },
  { name: 'Delivery', value: 15 },
  { name: 'Tents', value: 10 },
  { name: 'Sound', value: 18 },
  { name: 'MC', value: 12 },
];

const popularItemsData = [
  { name: 'Fried Rice', count: 40 },
  { name: 'Grilled Chicken', count: 30 },
  { name: 'Fish Fingers', count: 25 },
];

const COLORS = ['#ff7f00', '#1a1a1a', '#ffc658'];

const cardStyle = {
  flex: '1',
  minWidth: '120px',
  background: '#f77b07ff',
  color: '#fff',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.5rem',
};

const iconStyle = {
  fontSize: '1.8rem',
  color: '#faf9f9ff',
};

const DashboardHome = () => {
  // Example: Hardcoded user role (change this later to real user role)
  const userRole = 'superadmin';  // or 'admin'

  return (
    <div className="dashboard-parent">
      {/* Pass userRole as currentUserRole prop to Sidebar */}
      <Sidebar currentUserRole={userRole} />
      <div className="dashboard-content" style={{ padding: '2rem', backgroundColor: '#f9f9f9ff' }}>
        <h2 style={{ color: '#1a1a1a', display: 'flex', justifyContent: 'center', fontSize: '30px' }}>
          Welcome to Jesus Is Lord Admin Dashboard
        </h2>
        <p style={{ color: '#1a1a1a', display: 'flex', justifyContent: 'center' }}>
          <i>Manage services, orders, and customer insights.</i>
        </p>

        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <div style={cardStyle}>
            <FiShoppingCart style={iconStyle} />
            <h4>Total Orders</h4>
            <p>290</p>
          </div>
          <div style={cardStyle}>
            <FiUsers style={iconStyle} />
            <h4>Registered Customers</h4>
            <p>170</p>
          </div>
          <div style={cardStyle}>
            <FiTruck style={iconStyle} />
            <h4>Active Deliveries</h4>
            <p>35</p>
          </div>
          <div style={cardStyle}>
            <FiBriefcase style={iconStyle} />
            <h4>Catering Bookings</h4>
            <p>22</p>
          </div>
        </div>

        {/* Sales Overview Chart */}
        <div style={{ marginTop: '3rem' }}>
          <h3 className="center-title">Sales Overview (Last 8 Months)</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#ff7f00" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Demand Pie Chart */}
        <div style={{ marginTop: '3rem' }}>
          <h3 className="center-title">Service Demand Breakdown</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={serviceDemandData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#ff7f00"
                  dataKey="value"
                  label
                >
                  {serviceDemandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Ordered Items Bar Chart */}
        <div style={{ marginTop: '1rem' }}>
          <h3 className="center-title">Most Ordered Items</h3>
          <div style={{ width: '75%', height: 300, margin: '0 auto' }}>
            <ResponsiveContainer>
              <BarChart data={popularItemsData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ff7f00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Text */}
        <div style={{ marginTop: '2rem' }}>
          <h3 className="center-title">Overview</h3>
          <p>
            This dashboard gives you a bird's-eye view of the platform's performance, customer engagement, and popular services. Use the side menu to manage orders, services, staff, and menu items.
          </p>
        </div>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            padding: '1rem 0',
            marginTop: '3rem',
            fontSize: '0.9rem',
            color: '#666',
          }}
        >
          &copy; {new Date().getFullYear()} Jesus Is Lord Eatery & Catering Services. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardHome;
