import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import ReportForm from './ReportForm';
import MyReports from './MyReports';
import AQIDisplay from './AQIDisplay';
import AqiHistoryChart from './AqiHistoryChart';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, socket } = useAuth();
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

  const fetchAqiData = useCallback((latlng) => {
    if (socket) {
      setIsAqiLoading(true);
      setAirQualityData(null);
      // --- IMPORTANT: Set the chart location HERE ---
      setChartLocation(latlng);
      socket.emit('getAirQuality', { lat: latlng.lat, lon: latlng.lng });
    }
  }, [socket]);

  const handleMapClick = useCallback((latlng) => {
    console.log("Dashboard: Map clicked. Setting location for chart:", latlng);
    setMapClickCoords(latlng);
    fetchAqiData(latlng);
  }, [fetchAqiData]);

  const handleLocationFound = useCallback((latlng) => {
    console.log("Dashboard: User location found. Setting location for chart:", latlng);
    fetchAqiData(latlng);
  }, [fetchAqiData]);

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Welcome, {user.name}!</h2>
        <p className="text-gray-600">View community reports and check the AQI by clicking the map.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow w-full lg:w-2-3">
          <MapComponent 
            onMapClick={handleMapClick} 
            onLocationFound={handleLocationFound}
            socket={socket} 
          />
        </div>
        <div className="w-full lg:w-1/3">
          <AQIDisplay data={airQualityData} isLoading={isAqiLoading} />
          {/* We only render the chart if there's a location to check */}
          {chartLocation && <AqiHistoryChart location={chartLocation} />}
          <ReportForm mapClickCoords={mapClickCoords} />
          <MyReports />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;