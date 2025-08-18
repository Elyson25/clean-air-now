// src/utils/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // First, we wait for the initial authentication check to complete.
  // While isLoading is true, we don't render anything.
  if (isLoading) {
    return null; // Or a loading spinner component
  }

  // If the user is authenticated AND is an admin, allow access.
  // The <Outlet /> component will render the nested child route (e.g., the AdminDashboard page).
  if (isAuthenticated && user?.isAdmin) {
    return <Outlet />;
  }
  
  // If the user is not authenticated or is not an admin, redirect them.
  // We send them to the home page.
  return <Navigate to="/" replace />;
};

export default AdminRoute;