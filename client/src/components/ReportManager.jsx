import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReportManager = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/reports', config);
        setReports(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reports.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `http://localhost:5000/api/reports/${reportId}/status`,
        { status: newStatus },
        config
      );
      toast.success('Status updated successfully!');
      setReports(currentReports => 
        currentReports.map(report => 
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Reports</h2>
      
      {isLoading && <p className="text-gray-500">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{report.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-sm truncate">{report.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(report.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report._id, e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportManager;