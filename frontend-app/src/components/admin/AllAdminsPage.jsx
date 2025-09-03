import React, { useState } from 'react';

const mockAdmins = [
  { id: 1, email: 'admin1@example.com', role: 'admin' },
  { id: 2, email: 'superadmin@example.com', role: 'superadmin' },
  { id: 3, email: 'admin2@example.com', role: 'admin' },
];

const AllAdminsPage = () => {
  const [admins, setAdmins] = useState(mockAdmins);

  // Dummy handlers for edit/delete
  const handleEdit = (id) => {
    alert(`Edit admin with ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          All Admins List (Superadmin & Admin Access)
        </h2>

        {admins.length === 0 ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
            No admins found.
          </p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>
                  Email
                </th>
                <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>
                  Role
                </th>
                <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map(({ id, email, role }) => (
                <tr key={id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{email}</td>
                  <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{role}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(id)}
                      style={{
                        marginRight: '0.5rem',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#f77b07',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#d9534f',
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllAdminsPage;
