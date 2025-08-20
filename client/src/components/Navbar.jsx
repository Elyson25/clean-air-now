import React, { useState } from 'react'; // Import useState for mobile menu
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on logout
    navigate('/');
  };

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 shadow-sm relative">
      <h1 className="text-2xl font-bold">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-gray-800 no-underline">
          Clean Air Now
        </Link>
      </h1>
      
      {/* --- DESKTOP MENU (hidden on small screens) --- */}
      <nav className="hidden md:flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <span>Welcome, {user.name}!</span>
            {user.isAdmin && (<Link to="/admin" className="text-red-600 font-bold hover:underline">Admin</Link>)}
            <Link to="/profile" className="text-blue-600 hover:underline">Profile</Link>
            <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
            <button onClick={handleLogout} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Logout</button>
          </>
        ) : (
          <Link to="/auth" className="text-blue-600 font-bold hover:underline">Login / Register</Link>
        )}
      </nav>

      {/* --- MOBILE MENU BUTTON (hamburger icon, only visible on small screens) --- */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
          {/* Simple hamburger icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* --- MOBILE MENU (dropdown, appears when isMenuOpen is true) --- */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 md:hidden">
          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
              {user.isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Admin</Link>}
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login / Register</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;