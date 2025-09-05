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

// Sample data for charts
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

// Color scheme for charts
const COLORS = ['#ff7f00', '#1a1a1a', '#ffc658'];

const DashboardHome = () => {
  return (
    <div className="dashboard-content">
      <h2 className="dashboard-title">Welcome to Jesus Is Lord Admin Dashboard</h2>
      <p className="dashboard-subtitle">
        Manage services, orders, and customer insights.
      </p>
      
      {/* Stats Cards Section */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FiShoppingCart size={36} color="#ffffff" />
          </div>
          <div className="stat-info">
            <h3>Total Orders</h3>
            <p className="stat-value">290</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers size={36} color="#ffffff" />
          </div>
          <div className="stat-info">
            <h3>Registered Customers</h3>
            <p className="stat-value">170</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiTruck size={36} color="#ffffff" />
          </div>
          <div className="stat-info">
            <h3>Active Deliveries</h3>
            <p className="stat-value">35</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FiBriefcase size={36} color="#ffffff" />
          </div>
          <div className="stat-info">
            <h3>Catering Bookings</h3>
            <p className="stat-value">22</p>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="charts-section">
        {/* Sales Overview Chart */}
        <div className="chart-card">
          <h3>Sales Overview (Last 8 Months)</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#ff7f00" strokeWidth={2} activeDot={{ r: 8 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Service Demand Pie Chart */}
        <div className="chart-card">
          <h3>Service Demand Breakdown</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={serviceDemandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {serviceDemandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Most Ordered Items Bar Chart */}
        <div className="chart-card">
          <h3>Most Ordered Items</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer>
              <BarChart data={popularItemsData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ff7f00" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="summary-section">
        <h3>About Your Business Performance</h3>
        <p>
          This dashboard provides a comprehensive overview of your business operations. Monitor sales trends, 
          customer preferences, and service demand to make informed decisions and optimize your offerings.
        </p>
      </div>
      
      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '1rem',
          fontSize: '0.9rem',
          color: '#666',
        }}
      >
        &copy; {new Date().getFullYear()} Jesus Is Lord Eatery & Catering Services. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardHome;