// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import AQIDisplay from './AQIDisplay';
import ReportForm from './ReportForm';
import MyReports from './MyReports';
import MapComponent from './MapComponent';
import { useAuth } from '../context/AuthContext';

const SOCKET_SERVER_URL = "http://localhost:5000";

const Dashboard = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // This useEffect hook sets up the main socket connection for the dashboard.
  // It's responsible for fetching air quality data.
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('airQualityData', (data) => {
      setAirQualityData(data);
      setIsLoading(false);
      setError('');
    });

    // Clean up the connection when the component is unmounted.
    return () => newSocket.disconnect();
  }, []);

  const handleFetchAirQuality = (latlng) => {
    if (!socket) return;
    setIsLoading(true);
    setAirQualityData(null);
    setError('');
    socket.emit('getAirQuality', { lat: latlng.lat, lon: latlng.lng });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Welcome to your Dashboard, {user.name}!
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column containing the map and AQI display */}
        <div className="flex flex-col gap-8">
          <p className="text-center text-gray-600 -mb-4">
            Click anywhere on the map to get real-time air quality data.
          </p>
          
          {/* 
            We pass the 'socket' instance down to the MapComponent.
            This allows the map to listen for real-time events like 'newReport'.
          */}
          <MapComponent onMapClick={handleFetchAirQuality} socket={socket} />
          
          {isLoading && <p className="text-center text-blue-500">Loading air quality data...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <AQIDisplay data={airQualityData} />
        </div>

        {/* Right Column containing the report forms and lists */}
        <div className="flex flex-col gap-8">
          <ReportForm />
          <MyReports />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;