import React from 'react';
import UserList from '../components/UserList';
import ReportManager from '../components/ReportManager';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* ─── PREMIUM HEADER SECTION ─── */}
        <div className="mb-8 border-b border-slate-200 pb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Control Center
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                System administration, user privilege management, and real-time response logs.
              </p>
            </div>
            
            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full self-start md:self-auto">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Telemetry Nodes Online
              </span>
            </div>
          </div>
        </div>

        {/* ─── EXECUTIVE HIGH-IMPACT METRICS ROW ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Incidents</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-800">24</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+12%</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Pending Action</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-600">5</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Critical</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">System Users</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-slate-800">142</span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Active</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest block">GIS Gateway</span>
              <span className="text-xl font-bold mt-2 block tracking-tight">OpenStreetMap</span>
              <p className="text-[11px] text-indigo-200/80 mt-1 leading-relaxed">
                Live coordinate parsing active via map cluster layer.
              </p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* ─── TWO-COLUMN RESPONSIVE LAYOUT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Focus Space - 2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">Incidents Registry</h2>
                <p className="text-xs text-slate-500 mt-0.5">Review, verify, and route active environmental pollution alerts.</p>
              </div>
              <div className="p-6">
                <ReportManager />
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Controls - 1/3 width on large screens) */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800">System Operators</h2>
                <p className="text-xs text-slate-500 mt-0.5">Accounts database registry tracking user security tiers.</p>
              </div>
              <div className="p-6">
                <UserList />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
