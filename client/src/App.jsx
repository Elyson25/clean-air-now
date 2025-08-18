import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Import Components and Utils
import Navbar from './components/Navbar';
import AdminRoute from './utils/AdminRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import GuestRoute from './utils/GuestRoute'; // Import the new guest route protector

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Router>
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        <main>
          <Routes>
            {/* --- Public Route --- */}
            {/* Anyone can see the home page */}
            <Route path="/" element={<HomePage />} />

            {/* --- Guest-Only Routes --- */}
            {/* Only logged-out users can see this. Logged-in users will be redirected. */}
            <Route element={<GuestRoute />}>
              <Route path="/auth" element={<AuthPage />} />
            </Route>

            {/* --- User Protected Routes --- */}
            {/* Only logged-in users can see this. */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* --- Admin Protected Routes --- */}
            {/* Only admin users can see this. */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
            
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;