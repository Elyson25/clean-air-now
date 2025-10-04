import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  // If the user is authenticated, allow access to nested routes.
  if (isAuthenticated) {
    return <Outlet />;
  }
  
  // If not authenticated, redirect to the authentication page.
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;