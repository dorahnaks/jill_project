// src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your Flask backend URL
  timeout: 5000, // 5 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for auth tokens
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error("API Error Response:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error("API Request Error:", error.request);
    } else {
      // Error in request setup
      console.error("API Setup Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;