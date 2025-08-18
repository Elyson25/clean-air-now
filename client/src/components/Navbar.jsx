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
    <header className="bg-slate-100 shadow-md flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold text-gray-800">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Clean Air Now
        </Link>
      </h1>
      <nav>
        {isAuthenticated && user ? (
          // --- LOGGED-IN VIEW ---
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.name}!</span>
            
            {/* Conditional Admin Link */}
            {user.isAdmin && (
              <Link to="/admin" className="text-red-600 font-bold hover:underline">Admin</Link>
            )}

            <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
            
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          // --- LOGGED-OUT VIEW ---
          <div>
            <Link to="/auth" className="text-blue-600 hover:underline font-semibold">
              Login / Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;