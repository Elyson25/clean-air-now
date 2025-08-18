// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // To check initial auth status

  // This effect runs once on mount to check if a token exists
  useEffect(() => {
    if (token) {
      try {
        // In a real app, you would verify the token with the backend here.
        // For now, we'll trust the token if it exists and get user data from localStorage.
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // If token is invalid or user data is corrupt, log out
        logout();
      }
    }
    setIsLoading(false); // Finished initial check
  }, [token]);

  // Login function
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userData.token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // The value that will be available to all consuming components
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
  
  // We don't render children until the initial loading check is complete
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};