import React, { useState, useEffect, useCallback } from 'react';
// ... (all other imports are the same)
import MapComponent from './MapComponent';
import ReportForm from './ReportForm';
import MyReports from './MyReports';
import AQIDisplay from './AQIDisplay';
import AqiHistoryChart from './AqiHistoryChart';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, socket } = useAuth();
  // ... (all state and functions are the same)
  const [mapClickCoords, setMapClickCoords] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [isAqiLoading, setIsAqiLoading] = useState(false);
  const [chartLocation, setChartLocation] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('airQualityData', (data) => {
        setAirQualityData(data);
        setIsAqiLoading(false);
      });
    }
    return () => { if (socket) { socket.off('airQualityData'); } };
  }, [socket]);

  const fetchAqiData = useCallback((latlng) => { /* ... same as before ... */ }, [socket]);
  const handleMapClick = useCallback((latlng) => { /* ... same as before ... */ }, [fetchAqiData]);
  const handleLocationFound = useCallback((latlng) => { /* ... same as before ... */ }, [fetchAqiData]);


  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Welcome, {user.name}!</h2>
        <p className="text-gray-600">View community reports and check the AQI by clicking the map.</p>
      </div>
      {/* --- RESPONSIVE LAYOUT CHANGES --- */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Map */}
        <div className="flex-grow w-full lg:w-2/3">
          <MapComponent 
            onMapClick={handleMapClick} 
            onLocationFound={handleLocationFound}
            socket={socket} 
          />
        </div>

        {/* Right Column: Data and Forms */}
        {/* On mobile it's a full-width column (flex-col), on large screens it's a 1/3 width column (lg:flex-row) */}
        <div className="w-full lg:w-1/3">
          <AQIDisplay data={airQualityData} isLoading={isAqiLoading} />
          <AqiHistoryChart location={chartLocation} />
          <ReportForm mapClickCoords={mapClickCoords} />
          <MyReports />
        </div>
      </div>
    </div>
  );
};

// --- For clarity, the unchanged functions ---
const fetchAqiData_unchanged = (socket, setIsAqiLoading, setAirQualityData, setChartLocation) => (latlng) => {
  if (socket) {
    setIsAqiLoading(true);
    setAirQualityData(null);
    setChartLocation(latlng);
    socket.emit('getAirQuality', { lat: latlng.lat, lon: latlng.lng });
  }
};
const handleMapClick_unchanged = (setMapClickCoords, fetchAqiData) => (latlng) => {
  setMapClickCoords(latlng);
  fetchAqiData(latlng);
};

export default Dashboard;