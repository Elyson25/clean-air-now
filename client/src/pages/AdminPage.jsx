import React from 'react';
import UserList from '../components/UserList';
import ReportManager from '../components/ReportManager';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container" style={{ padding: '1.5rem' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* ─── PREMIUM ADMIN HEADER BANNER ─── */}
        <div className="user-hero-header">
          <h1 className="user-hero-title">Control Center</h1>
          <p className="user-hero-subtitle">
            System administration, real-time user privilege mappings, and community pollution response telemetry logs.
          </p>
        </div>

        {/* ─── FLEX-BASED DESKTOP SIDE-BY-SIDE / MOBILE COLUMN STACK ─── */}
        {/* This bypasses the old CSS breakpoints to run perfectly on all desktop screens! */}
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
          
          {/* Main Registry Management (2/3 width on wide screens) */}
          <div className="panel-premium-box w-full lg:w-2/3" style={{ margin: 0 }}>
            <div className="panel-header-section">
              <h2>Incidents Registry</h2>
              <p>Review, verify, status-track, and globally expunge active community air hazards.</p>
            </div>
            <div className="panel-body-padding">
              <ReportManager />
            </div>
          </div>

          {/* Sidebar System Operators Directory (1/3 width on wide screens) */}
          <div className="panel-premium-box w-full lg:w-1/3" style={{ margin: 0 }}>
            <div className="panel-header-section">
              <h2>System Operators</h2>
              <p>Live database accounts directory registry tracking active profile nodes.</p>
            </div>
            <div className="panel-body-padding">
              <UserList />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
