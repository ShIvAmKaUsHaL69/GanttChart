import { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Debug whenever auth state changes
  useEffect(() => {
    console.log("Auth Provider State:", {
      user: user ? `${user.username} (${user.id})` : 'null',
      isAuthenticated,
      isLoading,
      isAdmin
    });
  }, [user, isAuthenticated, isLoading, isAdmin]);

  // Load user from localStorage on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Initializing auth state...");
      setIsLoading(true);
      
      // Check if user is logged in
      if (AuthService.isLoggedIn()) {
        console.log("Token found in localStorage, attempting to restore session");
        
        // Get user from localStorage first for quick loading
        const storedUser = AuthService.getCurrentUser();
        
        if (storedUser) {
          console.log("User data found in localStorage:", storedUser.username);
          setUser(storedUser);
          setIsAuthenticated(true);
          setIsAdmin(storedUser.is_admin);
        }
        
        // Then fetch fresh data from API
        try {
          console.log("Fetching fresh user data from API...");
          const { success, user: freshUser } = await AuthService.fetchCurrentUser();
          
          if (success && freshUser) {
            console.log("Fresh user data received:", freshUser.username);
            setUser(freshUser);
            setIsAuthenticated(true);
            setIsAdmin(freshUser.is_admin);
          } else {
            console.log("Failed to fetch fresh user data, logging out");
            // If API call fails, log the user out
            handleLogout();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          handleLogout();
        }
      } else {
        console.log("No token found, user is not authenticated");
      }
      
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);
  
  // Login handler
  const handleLogin = async (username, password) => {
    console.log("Login handler called for:", username);
    setIsLoading(true);
    const { success, user, message } = await AuthService.login(username, password);
    
    if (success && user) {
      console.log("Login successful, updating auth state");
      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.is_admin);
      setIsLoading(false);
      return { success: true };
    }
    
    console.log("Login failed:", message);
    setIsLoading(false);
    return { success: false, message };
  };
  
  // Logout handler
  const handleLogout = () => {
    console.log("Logging out user");
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };
  
  // Context value
  const value = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login: handleLogin,
    logout: handleLogout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 