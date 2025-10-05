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
    // Add some top padding to the main container
    <div className="p-4 pt-8 md:pt-4"> 
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Welcome, {user.name}!</h2>
        <p className="text-gray-600">View community reports and check the AQI by clicking the map.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 flex-grow"> 
        
        <div className="flex-grow w-full lg:w-2/3 flex flex-col">

          {/* --- MODIFIED NASA TOGGLE --- */}
          {/* It's now outside the map's growing container for better layout control */}
          <div className="bg-white p-3 rounded-md shadow-md mb-4 flex items-center justify-between">
            <label htmlFor="nasa-toggle" className="font-medium text-gray-800">
              NASA Aerosol Layer
            </label>
            {/* A more visually appealing toggle switch */}
            <label htmlFor="nasa-toggle" className="inline-flex relative items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="nasa-toggle" 
                className="sr-only peer"
                checked={showNasaLayer}
                onChange={() => setShowNasaLayer(!showNasaLayer)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex-grow rounded-lg overflow-hidden shadow-lg"> 
            <MapComponent 
              onMapClick={handleMapClick} 
              onLocationFound={handleLocationFound}
              socket={socket} 
              showNasaLayer={showNasaLayer}
            />
          </div>
        </div>

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