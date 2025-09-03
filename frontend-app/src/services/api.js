import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:5000/api/v1/customer/register', // Change to match your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
