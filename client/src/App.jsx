// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Import Components and Utils
import Navbar from './components/Navbar';
import AdminRoute from './utils/AdminRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import GuestRoute from './utils/GuestRoute';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Router>
        <Navbar />
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <main>
          <Routes>
            {/* --- Public Route --- */}
            <Route path="/" element={<HomePage />} />

            {/* --- Guest-Only Routes --- */}
            <Route element={<GuestRoute />}>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Route>

            {/* --- User Protected Routes --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* --- Admin Protected Routes --- */}
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