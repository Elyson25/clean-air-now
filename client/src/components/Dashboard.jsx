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
  const [showNasaLayer, setShowNasaLayer] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('airQualityData', (data) => {
        setAirQualityData(data);
        setIsAqiLoading(false);
      });
    }
    return () => {
      if (socket) {
        socket.off('airQualityData');
      }
    };
  }, [socket]);

  const fetchAqiData = useCallback((latlng) => {
    if (socket) {
      setIsAqiLoading(true);
      setAirQualityData(null);
      setChartLocation(latlng);
      socket.emit('getAirQuality', { lat: latlng.lat, lon: latlng.lng });
    }
  }, [socket]);

  const handleMapClick = useCallback((latlng) => {
    setMapClickCoords(latlng);
    fetchAqiData(latlng);
  }, [fetchAqiData]);

  const handleLocationFound = useCallback((latlng) => {
    fetchAqiData(latlng);
  }, [fetchAqiData]);

  return (
    // This main container is now a flex column that will grow to fill the available height
    <div className="flex flex-col flex-grow p-4"> 
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Welcome, {user.name}!</h2>
        <p className="text-gray-600">View community reports and check the AQI by clicking the map.</p>
      </div>
      
      {/* This content area is also a flex container that will grow */}
      <div className="flex flex-col lg:flex-row gap-6 flex-grow"> 
        
        {/* The map container (left side) will grow and is a flex column */}
        <div className="flex-grow w-full lg:w-2/3 flex flex-col">
          <div className="bg-white p-2 rounded-md shadow-md mb-2 flex items-center justify-end">
            <label htmlFor="nasa-toggle" className="mr-3 text-sm font-medium text-gray-700">
              Show NASA Aerosol Layer
            </label>
            <input
              type="checkbox"
              id="nasa-toggle"
              checked={showNasaLayer}
              onChange={() => setShowNasaLayer(!showNasaLayer)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </div>
          {/* This new div allows the MapComponent to grow to fill the space */}
          <div className="flex-grow rounded-lg overflow-hidden shadow-lg"> 
            <MapComponent 
              onMapClick={handleMapClick} 
              onLocationFound={handleLocationFound}
              socket={socket} 
              showNasaLayer={showNasaLayer}
            />
          </div>
        </div>

        {/* The right-hand column will scroll if its content is too long on large screens */}
        <div className="w-full lg:w-1/3 lg:max-h-full lg:overflow-y-auto">
          <AQIDisplay data={airQualityData} isLoading={isAqiLoading} />
          <AqiHistoryChart location={chartLocation} />
          <ReportForm mapClickCoords={mapClickCoords} />
          <MyReports />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;