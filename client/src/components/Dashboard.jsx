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
    <div className="admin-dashboard-container">
      <div className="max-w-7xl mx-auto">
        
        {/* ─── PREMIUM WELCOME HEADER BANNER ─── */}
        <div className="user-hero-header">
          <h2 className="user-hero-title">Welcome, {user.name}!</h2>
          <p className="user-hero-subtitle">
            View community reports and check real-time air quality metrics by interacting with the map workspace.
          </p>
        </div>
        
        {/* ─── MASTER TOP TELEMETRY GRID (Map + Live AQI Pollutant Grid) ─── */}
        <div className="dashboard-top-grid">
          
          {/* Map Container Block (Occupies 2/3 Desktop Width) */}
          <div className="w-full flex flex-col">
            {/* NASA Control Slider Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 flex items-center justify-between">
              <label htmlFor="nasa-toggle" className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                NASA Aerosol Overlay Layer
              </label>
              <label htmlFor="nasa-toggle" className="inline-flex relative items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="nasa-toggle" 
                  className="sr-only peer"
                  checked={showNasaLayer}
                  onChange={() => setShowNasaLayer(!showNasaLayer)}
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            
            {/* Map Frame Layer Container */}
            <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <MapComponent 
                onMapClick={handleMapClick} 
                onLocationFound={handleLocationFound}
                socket={socket} 
                showNasaLayer={showNasaLayer}
              />
            </div>
          </div>

          {/* Current Real-Time Metrics Frame (Occupies 1/3 Desktop Width) */}
          <div className="w-full">
            <AQIDisplay data={airQualityData} isLoading={isAqiLoading} />
          </div>

        </div>

        {/* ─── MASTER BOTTOM ANALYTICS GRID (Charts & Logs vs Reporting Forms) ─── */}
        <div className="dashboard-bottom-grid">
          
          {/* Left Column Workspace: Analytical Trends & Historic Track Logs */}
          <div className="space-y-6 flex flex-col gap-6">
            <div className="panel-premium-box">
              <div className="panel-header-section">
                <h2>Air Quality Timeline Analytics</h2>
                <p>Historical trends tracking atmospheric index values over the last 7 days.</p>
              </div>
              <div className="panel-body-padding">
                <AqiHistoryChart location={chartLocation} />
              </div>
            </div>
          </div>

          {/* Right Column Workspace: Incident Incident Form Reports Entry Blocks */}
          <div className="space-y-6 flex flex-col gap-6">
            <div className="panel-premium-box">
              <div className="panel-header-section">
                <h2>Report an Air Quality Incident</h2>
                <p>Crowdsource environment pollution hazards directly into the community grid map.</p>
              </div>
              <div className="panel-body-padding">
                <ReportForm mapClickCoords={mapClickCoords} />
              </div>
            </div>

            <div className="panel-premium-box">
              <div className="panel-header-section">
                <h2>My Filed Inquiries Log</h2>
                <p>Track investigation statuses for submissions processed from this profile node.</p>
              </div>
              <div className="panel-body-padding">
                <MyReports />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
