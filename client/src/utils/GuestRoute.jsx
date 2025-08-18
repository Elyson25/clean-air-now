// client/src/utils/GuestRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  // If the user IS authenticated, redirect them away from the guest page (e.g., login page)
  // to their dashboard.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is NOT authenticated, allow access to the guest page.
  return <Outlet />;
};

export default GuestRoute;