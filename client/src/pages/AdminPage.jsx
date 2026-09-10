import React from 'react';
import UserList from '../components/UserList';
import ReportManager from '../components/ReportManager';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <div className="max-w-7xl mx-auto">
        
        {/* ─── PREMIUM ADMIN HEADER BANNER ─── */}
        <div className="user-hero-header">
          <h1 className="user-hero-title">Control Center</h1>
          <p className="user-hero-subtitle">
            System administration, real-time user privilege mappings, and community pollution response telemetry logs.
          </p>
        </div>

        {/* ─── EXPLICIT SIDE-BY-SIDE DESKTOP GRID / MOBILE STACK ─── */}
        <div className="dashboard-top-grid" style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* Main Registry Management (Occupies 2/3 width on PC) */}
          <div className="panel-premium-box" style={{ margin: 0 }}>
            <div className="panel-header-section">
              <h2>Incidents Registry</h2>
              <p>Review, verify, status-track, and globally expunge active community air hazards.</p>
            </div>
            <div className="panel-body-padding">
              <ReportManager />
            </div>
          </div>

          {/* Sidebar System Operators Directory (Occupies 1/3 width on PC) */}
          <div className="panel-premium-box" style={{ margin: 0 }}>
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
