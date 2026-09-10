import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';

const MyReports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/api/reports/myreports`, config);
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch your reports.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [token]);

  // ─── ✨ NEW: SECURE PAYLOAD DISPATCH FOR PURGING ENTITIES ✨ ───
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you absolutely sure you want to expunge this incident report?')) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/api/reports/${reportId}`, config);
      toast.success('Incident log successfully expunged!');
      
      // Instantly optimize local state array arrays to clear it from the UI feed
      setReports((prevReports) => prevReports.filter((report) => report._id !== reportId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unauthorized or locked under active review.');
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

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Resolved': return '#10b981';
      case 'In Review': return '#f59e0b';
      default: return '#cbd5e1';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 space-y-2">
        <div className="h-5 w-5 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-medium text-slate-400 animate-pulse">Syncing personal log history...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs text-center">{error}</div>;
  }

  return (
    <div className="w-full">
      {reports.length === 0 ? (
        <div className="text-center py-6 text-sm font-medium text-slate-400">
          You have not submitted any community reports yet from this profile node.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '340px', overflowY: 'auto' }}>
          {reports.map((report) => (
            <div 
              key={report._id} 
              className="timeline-item-card"
              style={{ 
                borderLeftColor: getStatusBorderColor(report.status),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.925rem', fontWeight: 600, color: '#334155' }}>
                  {report.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    color: report.status === 'Resolved' ? '#059669' : report.status === 'In Review' ? '#d97706' : '#64748b'
                  }}>
                    ● {report.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Submitted: {formatDate(report.createdAt)}
                  </span>
                </div>
              </div>

              {/* 🗑️ FRONTEND USER CONTROL PRIVILEGE BUTTON CARD */}
              {/* Automatically locks/hides via backend validation rules if status moves past Submitted */}
              {report.status === 'Submitted' && (
                <button
                  onClick={() => handleDeleteReport(report._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '1.15rem',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'background 0.2s'
                  }}
                  title="Remove report"
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
