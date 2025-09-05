import axios from "axios";

// Get API URL from environment or fallback to current host
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 
                         window.location.protocol + '//' + window.location.host;

const API = axios.create({
  baseURL: REACT_APP_API_URL + "/api",
  timeout: 10000,
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
  (response) => {
    console.log(`Received response for ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("API Error Details:");
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;