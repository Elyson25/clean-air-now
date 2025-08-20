import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';

const AqiHistoryChart = ({ location }) => {
  const { token } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // This function fetches the data when the 'location' prop changes.
    const fetchHistory = async () => {
      if (!location || !token) {
        setHistoryData([]);
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: { lat: location.lat, lon: location.lng }, // Pass coords as query params
        };
        const res = await axios.get(`${API_URL}/api/history`, config);

        // We need to format the data for the chart
        const formattedData = res.data.map(log => ({
          aqi: log.aqi,
          // Format the date to be more readable, e.g., "Aug 20, 10:30 AM"
          date: format(new Date(log.createdAt), 'MMM d, h:mm a'),
        }));
        setHistoryData(formattedData);

      } catch (err) {
        setError('Could not fetch historical data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [location, token]); // Re-fetch when location or token changes

  if (isLoading) {
    return <p className="text-center p-4">Loading historical data...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center p-4">{error}</p>;
  }

  // If there's no location selected or no data, don't show the chart
  if (!location || historyData.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-300 p-4 rounded-lg max-w-lg mx-auto my-6 bg-white">
      <h3 className="text-lg font-semibold text-center mb-4">AQI Trend (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={historyData}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize="12px" />
          <YAxis domain={[0, 5]} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aqi" stroke="#8884d8" activeDot={{ r: 8 }} name="Air Quality Index" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AqiHistoryChart;