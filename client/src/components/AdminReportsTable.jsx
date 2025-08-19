// client/src/components/AdminReportsTable.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig'; // Import the central URL

const AdminReportsTable = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllReports = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/api/reports`, config); // Use the central URL
        setReports(res.data);
      } catch (err) {
        setError('Failed to fetch reports.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllReports();
  }, [token]);

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { status: newStatus };
      await axios.put(`${API_URL}/api/reports/${reportId}/status`, body, config); // Use the central URL
      setReports(reports.map(report =>
        report._id === reportId ? { ...report, status: newStatus } : report
      ));
      toast.success('Report status updated!');
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
    }
  };

  if (isLoading) return <p className="text-center p-4">Loading reports...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg my-6">
      <h2 className="text-xl font-semibold p-4 border-b">All User Reports</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">User</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {reports.map((report) => (
              <tr key={report._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{new Date(report.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">{report.user ? report.user.name : 'N/A'}</td>
                <td className="py-3 px-4 max-w-sm truncate">{report.description}</td>
                <td className="py-3 px-4">
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                    className="p-1 border border-gray-300 rounded-md bg-white"
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
        {reports.length === 0 && <p className="p-4 text-center">No reports found.</p>}
      </div>
    </div>
  );
};

export default AdminReportsTable;