// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Effect to check for existing user in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If data is corrupt, clear it
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  // Effect to manage the socket connection based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      console.log('AuthContext: User is authenticated. Attempting to connect socket...');
      const newSocket = io(SOCKET_SERVER_URL);

      newSocket.on('connect', () => {
        // --- THIS IS THE MOST IMPORTANT LOG ---
        console.log(`%cAuthContext: Socket connected successfully! ID: ${newSocket.id}`, 'color: green; font-weight: bold;');
      });
      
      newSocket.on('connect_error', (err) => {
        // --- THIS LOG WILL SHOW CONNECTION ERRORS ---
        console.error(`%cAuthContext: Socket connection error! Reason: ${err.message}`, 'color: red; font-weight: bold;');
      });

      setSocket(newSocket);

      // Cleanup function: runs when the user logs out
      return () => {
        console.log('AuthContext: Disconnecting socket.');
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      console.log('AuthContext: User is not authenticated. Socket not connected.');
    }
  }, [isAuthenticated]); // Dependency: runs when isAuthenticated changes

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userData.token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    socket, // Expose socket through the context
    login,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};