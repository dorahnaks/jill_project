// src/components/admin/StaffPage.jsx
import React, { useEffect, useState } from 'react';
import './admin.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const mockStaff = [
  {
    id: 1,
    name: 'Samuel Owino',
    role: 'Chef',
    email: 'samuel.owino@jilfoods.com',
    phone: '+256701234567',
  },
  {
    id: 2,
    name: 'Grace Nakato',
    role: 'Cashier',
    email: 'grace.nakato@jilfoods.com',
    phone: '+256703456789',
  },
  {
    id: 3,
    name: 'David Kimani',
    role: 'Delivery Driver',
    email: 'david.kimani@jilfoods.com',
    phone: '+256705678901',
  },
  {
    id: 4,
    name: 'Ruth Akello',
    role: 'Event Coordinator',
    email: 'ruth.akello@jilfoods.com',
    phone: '+256707890123',
  },
  {
    id: 5,
    name: 'Peter Musoke',
    role: 'Supervisor',
    email: 'peter.musoke@jilfoods.com',
    phone: '+256709012345',
  },
];

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStaff(mockStaff);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="staff-page-wrapper">
      <div className="staff-page">
        {/* <h2 className="staff-title">Staff Dashboard</h2> */}

        {loading ? (
          <p className="center">Loading staff...</p>
        ) : (
          <div className="staff-table-container">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Staff ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length > 0 ? (
                  staff.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>{member.email || 'N/A'}</td>
                      <td>{member.phone || 'N/A'}</td>
                      <td className="action-buttons">
                        <div className="tooltip-wrapper">
                          <button className="icon-btn update">
                            <FaEdit />
                            <span className="tooltip-text">Edit</span>
                          </button>
                        </div>
                        <div className="tooltip-wrapper">
                          <button className="icon-btn delete">
                            <FaTrash />
                            <span className="tooltip-text">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-staff">No staff found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffPage;
