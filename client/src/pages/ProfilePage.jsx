import React from 'react';
import { useAuth } from '../context/AuthContext';
import UpdateProfile from '../components/UpdateProfile';
import UpdatePassword from '../components/UpdatePassword';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="admin-dashboard-container flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 py-12">
          <div className="h-6 w-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400 animate-pulse">Syncing profile token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="max-w-7xl mx-auto">
        
        {/* ─── PREMIUM PROFILE HEADER BANNER ─── */}
        <div className="user-hero-header">
          <h2 className="user-hero-title">Account Settings</h2>
          <p className="user-hero-subtitle">
            Manage your personal credentials, identity identity logs, and security passwords for <strong>{user.email}</strong>.
          </p>
        </div>

        {/* ─── RESPONSIVE TWO-COLUMN SIDE-BY-SIDE PROFILE GRID ─── */}
        <div className="profile-workspace-grid">
          
          {/* Left Column Box: Personal Identity Data Management */}
          <div className="panel-premium-box">
            <div className="panel-header-section">
              <h2>Personal Information</h2>
              <p>Update your public identity metadata and registered email handle.</p>
            </div>
            <div className="panel-body-padding">
              <UpdateProfile />
            </div>
          </div>

          {/* Right Column Box: Cryptographic Access Management */}
          <div className="panel-premium-box">
            <div className="panel-header-section">
              <h2>Security Credentials</h2>
              <p>Modify your platform login authentication password strings safely.</p>
            </div>
            <div className="panel-body-padding">
              <UpdatePassword />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
