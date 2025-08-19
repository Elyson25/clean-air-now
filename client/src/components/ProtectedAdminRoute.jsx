import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    // While checking auth, show a loading message or spinner
    return <div>Loading...</div>;
  }

  // If the user is authenticated AND is an admin, allow access.
  // The <Outlet /> component renders the child route element (our AdminPage).
  if (isAuthenticated && user.isAdmin) {
    return <Outlet />;
  }

  // Otherwise, redirect them to the dashboard or homepage.
  return <Navigate to="/dashboard" />;
};

export default ProtectedAdminRoute;