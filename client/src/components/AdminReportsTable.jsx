// client/src/components/AdminReportsTable.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminReportsTable = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch all reports from the admin endpoint
  const fetchAllReports = async () => {
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/reports', config);
      setReports(res.data);
    } catch (err) {
      setError('Failed to fetch reports.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reports when the component mounts
  useEffect(() => {
    fetchAllReports();
  }, [token]); // Dependency on token ensures we have it before fetching

  // Handler for when an admin changes a report's status
  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { status: newStatus };
      
      // Call the PUT endpoint to update the status
      await axios.put(`http://localhost:5000/api/reports/${reportId}/status`, body, config);

      // Update the state locally for an instant UI update
      setReports(reports.map(report =>
        report._id === reportId ? { ...report, status: newStatus } : report
      ));
      toast.success('Report status updated!');
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
    }
  };

  if (isLoading) return <p>Loading reports...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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