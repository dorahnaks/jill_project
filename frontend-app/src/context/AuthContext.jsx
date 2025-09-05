// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add debug log
  console.log("AuthProvider initialized");

  const login = async (email, password, role = 'admin') => {
    console.log(`Attempting login for ${email} with role ${role}`);
    
    try {
      let endpoint;
      if (role === 'admin') {
        endpoint = '/api/v1/auth/login';
      } else {
        endpoint = '/api/v1/auth/customer-login';
      }

      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password
      });

      console.log("Login response:", response.data);
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Authentication failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.get("http://localhost:5000/api/v1/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Profile fetch error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};