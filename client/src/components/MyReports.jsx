// client/src/components/MyReports.jsx
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

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (isLoading) return <p className="text-center p-4">Loading your reports...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

  return (
    <div className="border border-gray-300 rounded-lg max-w-lg mx-auto my-6 bg-white">
      <h3 className="text-xl font-semibold p-4 border-b">My Submitted Reports</h3>
      {reports.length === 0 ? (
        <p className="p-4 text-center text-gray-500">You have not submitted any reports yet.</p>
      ) : (
        <ul className="list-none p-0">
          {reports.map((report) => (
            <li key={report._id} className="border-b last:border-b-0 p-4">
              <p><strong>Description:</strong> {report.description}</p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {report.status} | 
                <strong> Submitted:</strong> {formatDate(report.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReports;