import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';
import toast from 'react-hot-toast';

const AqiHistoryChart = ({ location }) => {
  const { token } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      // Don't fetch if location or token is missing
      if (!location || !token) {
        setHistoryData([]);
        return;
      }

      // --- ADDED LOG ---
      console.log("AqiHistoryChart: Fetching history for", location);
      setIsLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          params: { lat: location.lat, lon: location.lng },
        };
        const res = await axios.get(`${API_URL}/api/history`, config);

        if (res.data && res.data.length > 0) {
          const formattedData = res.data.map(log => ({
            aqi: log.aqi,
            date: format(new Date(log.createdAt), 'MMM d, h:mm a'),
          }));
          setHistoryData(formattedData);
        } else {
          // If the API returns no data, clear the chart and notify
          setHistoryData([]);
          toast.success('No historical AQI data found for this specific area.');
        }

      } catch (err) {
        console.error("AqiHistoryChart Error:", err);
        toast.error('Could not fetch historical data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [location, token]);

  // Don't render anything if there's no data and it's not loading
  if (historyData.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <div className="border border-gray-300 p-4 rounded-lg max-w-lg mx-auto my-6 bg-white">
      <h3 className="text-lg font-semibold text-center mb-4">AQI Trend (Last 7 Days)</h3>
      {isLoading ? (
        <p className="text-center p-4">Loading historical data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize="12px" angle={-25} textAnchor="end" height={50} />
            <YAxis domain={[0, 5]} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="aqi" stroke="#8884d8" activeDot={{ r: 8 }} name="Air Quality Index" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AqiHistoryChart;