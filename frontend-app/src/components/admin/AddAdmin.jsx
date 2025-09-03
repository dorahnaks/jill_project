import React, { useState } from 'react';

const AddAdmin = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success or error message

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Mock API call with setTimeout
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: `Admin (${email}) with role "${role}" added successfully!` });
      setEmail('');
      setRole('admin');
    }, 1500);
  };

  return (
    // Full-screen flexbox container centers the form vertically + horizontally
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',   // full viewport height
        backgroundColor: '#f5f5f5'  // optional subtle background
      }}
    >
      <div style={{ 
        padding: '2rem', 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Add New Admin</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email:</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Role:</label><br />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#07f72fff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            {loading ? 'Adding...' : 'Add Admin'}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: '1rem',
              color: message.type === 'error' ? 'red' : 'green',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddAdmin;


