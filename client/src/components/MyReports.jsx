import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get('http://localhost:5000/api/reports/myreports', config);
        
        setReports(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reports.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">My Submitted Reports</h3>
      {isLoading ? (
        <p className="text-gray-500">Loading your reports...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500">You have not submitted any reports yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {reports.map((report) => (
            <li key={report._id} className="py-4">
              <p className="text-gray-800">{report.description}</p>
              <p className="text-sm text-gray-500 mt-2">
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