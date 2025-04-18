import axios from 'axios';

// Hardcoded API URL for now to ensure it's correct
const API_URL = 'http://localhost:5000/api';
console.log('API URL configured as:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, 
                { hasToken: !!token });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`, 
                { success: response.data?.success });
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status || 'Unknown'} from ${error.config?.url}`, 
                 { message: error.response?.data?.message || error.message });
    
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // If unauthorized or forbidden, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 