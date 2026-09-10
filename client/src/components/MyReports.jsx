import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig'; // Import the central URL

const MyReports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/api/reports/myreports`, config); // Use the central URL
        setReports(res.data);
      } catch (err) {
        setError('Failed to fetch your reports.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper utility to inject specific accent line colors matching your report state
  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Resolved':
        return '#10b981'; // Sleek Emerald Green
      case 'In Review':
        return '#f59e0b'; // Premium Amber Yellow
      default:
        return '#cbd5e1'; // Clean Muted Slate
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
    return (
      <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-medium text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      {reports.length === 0 ? (
        <div className="text-center py-6 text-sm font-medium text-slate-400">
          You have not submitted any community reports yet from this profile node.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
          {reports.map((report) => (
            <div 
              key={report._id} 
              className="timeline-item-card"
              style={{ borderLeftColor: getStatusBorderColor(report.status) }}
            >
              {/* Description Content Summary */}
              <p style={{ margin: 0, fontSize: '0.925rem', fontWeight: 600, color: '#334155', leadingRelaxed: '1.4' }}>
                {report.description}
              </p>
              
              {/* Contextual Tracking Info Footer Meta Stack */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span 
                  style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    color: report.status === 'Resolved' ? '#059669' : report.status === 'In Review' ? '#d97706' : '#64748b'
                  }}
                >
                  ● {report.status}
                </span>
                
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  Filed: {formatDate(report.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
