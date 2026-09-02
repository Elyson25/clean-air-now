import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReportManager = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Automatically parse your live production backend URL from Vercel's environments configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_BASE_URL}/api/reports`, config);
        setReports(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reports.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [token, API_BASE_URL]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `${API_BASE_URL}/api/reports/${reportId}/status`,
        { status: newStatus },
        config
      );
      toast.success(`Incident status marked as: ${newStatus}`);
      setReports(currentReports => 
        currentReports.map(report => 
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (err) {
      toast.error('Failed to update incident privilege status.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper utility to dynamically inject sleek status pill backgrounds based on your Mongoose schemas
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full">
      {/* Loading State Skeleton Overlay */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Syncing system logs...</p>
        </div>
      )}

      {/* Error Boundary Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
          <span className="text-base">⚠️</span> {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle px-6">
            <div className="overflow-hidden border border-slate-100 rounded-xl">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Reporting Citizen
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Incident Summary
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Timeline Stamp
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Operational Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* Column 1: User details */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            {(report.user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {report.user?.name || 'Anonymous User'}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Description */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600 max-w-xs md:max-w-md truncate font-medium" title={report.description}>
                          {report.description}
                        </p>
                      </td>

                      {/* Column 3: Datetime */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                          {formatDate(report.createdAt)}
                        </span>
                      </td>

                      {/* Column 4: Interactive Status Dropdown Switcher */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={report.status}
                            onChange={(e) => handleStatusChange(report._id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all shadow-sm ${getStatusStyles(report.status)}`}
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="In Review">In Review</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </div>
                      </td>

                    </tr>
                  ))}

                  {/* Empty State Handler */}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-sm font-medium text-slate-400">
                        No air quality incidents logged in the system database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManager;
