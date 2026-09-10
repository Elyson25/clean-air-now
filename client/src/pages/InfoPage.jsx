import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const InfoPage = () => {
  const location = useLocation();
  const isPrivacy = location.pathname === '/privacy-policy';

  return (
    <div className="admin-dashboard-container py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        
        <Link to="/dashboard" className="text-sm font-bold text-blue-600 hover:underline block mb-6 no-underline">
          ← Return to Dashboard
        </Link>

        {isPrivacy ? (
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-xs text-slate-400 mb-6">Last Updated: September 10, 2026</p>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>At Clean Air Now, protecting your geospatial and registration telemetry is a core priority.</p>
              <h2 className="text-base font-bold text-slate-800 mt-6">1. Data Capture Metrics</h2>
              <p>When you file an active incident report, the platform temporarily caches your latitude, longitude coordinate nodes, and user profile name handles to map environmental threats accurately.</p>
              <h2 className="text-base font-bold text-slate-800 mt-6">2. Information Sharing</h2>
              <p>Your data logs are processed transparently via WebSockets to synchronize live community maps. We never trade or pass personal access logs onto external monetization frameworks.</p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Community Guidelines</h1>
            <p className="text-xs text-slate-400 mb-6">Last Updated: September 10, 2026</p>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>Welcome to the Clean Air Now atmospheric monitoring grid. To ensure reporting integrity, all operators must follow these parameters:</p>
              <h2 className="text-base font-bold text-slate-800 mt-6">1. Verified Reporting</h2>
              <p>Only file reports for active environmental hazards (heavy smoke, construction dust, agricultural burning) that you can visually verify. Fake or malicious coordinates will result in profile suspension.</p>
              <h2 className="text-base font-bold text-slate-800 mt-6">2. Professional Integrity</h2>
              <p>Keep your descriptions objective, precise, and focused strictly on the air hazard timeline tracking data.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InfoPage;
