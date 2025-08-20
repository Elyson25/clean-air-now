// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout
  };

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 shadow-sm">
      <h1 className="text-2xl font-bold">
        {/* The main brand link now goes to the dashboard if logged in, otherwise to the homepage */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-gray-800 no-underline">
          Clean Air Now
        </Link>
      </h1>
      <nav>
        {isAuthenticated && user ? (
          // --- Logged-in User View ---
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}!</span>

            {/* Conditional link for admins */}
            {user.isAdmin && (
              <Link to="/admin" className="text-red-600 font-bold hover:underline">Admin</Link>
            )}
            
            <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>

            <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
            
            <button onClick={handleLogout} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Logout
            </button>
          </div>
        ) : (
          // --- Logged-out User View ---
          <div>
            <Link to="/auth" className="text-blue-600 font-bold hover:underline">
              Login / Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;