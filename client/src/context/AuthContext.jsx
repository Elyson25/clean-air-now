import React, { createContext, useState, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { API_URL } from '../apiConfig'; // Import the central URL

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

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
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(API_URL); // Use the central URL
      newSocket.on('connect', () => {
        console.log(`Socket connected successfully! ID: ${newSocket.id}`);
      });
      newSocket.on('connect_error', (err) => {
        console.error(`Socket connection error! Reason: ${err.message}`);
      });
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isAuthenticated]);

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

  const value = { user, token, isAuthenticated, isLoading, socket, login, logout };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};