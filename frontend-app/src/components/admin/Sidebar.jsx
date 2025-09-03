import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './admin.css';

// Import icons from react-icons
import { 
  FaTachometerAlt, 
  FaShoppingCart, 
  FaUsers, 
  FaUtensils, 
  FaUserShield, 
  FaUserPlus, 
  FaUserCog, 
  FaConciergeBell 
} from 'react-icons/fa';

const Sidebar = ({ currentUserRole }) => {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const toggleDropdown = () => setAdminDropdownOpen(!adminDropdownOpen);

  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo" style={{ marginBottom: "2rem" }}>
        <img src={logo} alt="JIL Logo" style={{ width: "150px" }} />
      </div>
      <h3>Admin Panel</h3>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link to="/admin"><FaTachometerAlt /> Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/orders"><FaShoppingCart /> Orders</Link>
          </li>
          <li>
            <Link to="/admin/staff"><FaUsers /> Staff</Link>
          </li>
          <li>
            <Link to="/admin/menuitem"><FaUtensils /> Menuitem</Link>
          </li>

          <li>
            <button
              onClick={toggleDropdown}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: 0,
                margin: 0,
              }}
            >
              <FaUserShield /> Admin {adminDropdownOpen ? '▲' : '▼'}
            </button>

            {adminDropdownOpen && (
              <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
                {currentUserRole?.toLowerCase() === 'superadmin' && (
                  <li>
                    <Link to="/admin/add-admin"><FaUserPlus /> Add Admin</Link>
                  </li>
                )}
                <li>
                  <Link to="/admin/all-admins"><FaUserCog /> Show All Admins</Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/admin/catering-events"><FaConciergeBell /> Catering Events</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
