import api from './api';

const AuthService = {
  // Login user and store token and user info
  login: async (username, password) => {
    try {
      console.log("AuthService: Attempting login for:", username);
      
      // Try a simple API test first to check connectivity
      try {
        const testResponse = await fetch('http://localhost:5000/api/test');
        const testData = await testResponse.json();
        console.log("API connectivity test result:", testData);
      } catch (testErr) {
        console.error("API connectivity test failed:", testErr);
        return { 
          success: false, 
          message: `Server connection error. Please ensure the backend server is running: ${testErr.message}` 
        };
      }
      
      // Proceed with actual login
      console.log("AuthService: Sending login request to:", `${api.defaults.baseURL}/auth/login`);
      const response = await api.post('/auth/login', { username, password });
      
      console.log("AuthService: Login response:", response.data);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        console.log("AuthService: Login successful, storing token and user data");
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("AuthService: Login error:", error);
      // More detailed error information
      const errorDetails = {
        message: error.response?.data?.message || 'Login failed',
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      };
      
      console.error("AuthService: Error details:", errorDetails);
      
      return { 
        success: false, 
        message: `Login failed: ${errorDetails.message} (${errorDetails.status || 'Network error'})` 
      };
    }
  },
  
  // Logout by removing user and token from storage
  logout: () => {
    console.log("AuthService: Logging out user");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      localStorage.removeItem('user');
      return null;
    }
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
  
  // Check if user is admin
  isAdmin: () => {
    const user = AuthService.getCurrentUser();
    return user ? user.is_admin : false;
  },
  
  // Get current user from API
  fetchCurrentUser: async () => {
    try {
      console.log("AuthService: Fetching current user data");
      const response = await api.get('/auth/me');
      if (response.data.success) {
        console.log("AuthService: Current user data fetched successfully");
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return { success: true, user: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("AuthService: Error fetching user data:", error);
      const message = error.response?.data?.message || 'Failed to fetch user data';
      return { success: false, message };
    }
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      return { success: false, message };
    }
  }
};

export default AuthService; 