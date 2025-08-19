import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while we check for authentication token.
  if (isLoading) {
    return <div>Loading page...</div>;
  }

  // If the user is authenticated, render the child component (e.g., DashboardPage).
  // The <Outlet /> is a placeholder for the actual page component.
  if (isAuthenticated) {
    return <Outlet />;
  }

  // If not authenticated, redirect the user to the authentication page.
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;