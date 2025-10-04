import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';
import NasaLayer from './NasaLayer'; // Import the new NASA layer component

// --- Icon ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// --- Custom Icons ---
const liveLocationIcon = new L.divIcon({ className: 'live-location-icon', iconSize: [18, 18] });
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, zoom, map]);
  return null;
};

// Component now accepts a new prop: showNasaLayer
const MapComponent = ({ onMapClick, socket, onLocationFound, showNasaLayer }) => {
  const [position, setPosition] = useState([20, 0]); // Default to a more global view
  const [reports, setReports] = useState([]);
  const [zoom, setZoom] = useState(3);
  const [userHasLocation, setUserHasLocation] = useState(false);

  // Effect to fetch initial public reports
  useEffect(() => {
    const fetchPublicReports = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reports/public`);
        setReports(res.data);
      } catch (error) { console.error('Failed to fetch public reports:', error); }
    };
    fetchPublicReports();
  }, []);

  // Effect to listen for real-time updates
  useEffect(() => {
    if (socket) {
      socket.on('newReport', (newReport) => {
        toast.success('New incident reported!');
        setReports(prevReports => [newReport, ...prevReports]);
      });
    }
    return () => { if (socket) { socket.off('newReport'); } };
  }, [socket]);

  // Effect for Geolocation
  useEffect(() => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported."); return; }
    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition([newPos.lat, newPos.lng]);
        setZoom(13);
        setUserHasLocation(true);
        toast.success("Your location found!");
        if (onLocationFound) { onLocationFound(newPos); }
      },
      (error) => { toast.error("Could not get your location."); },
      options
    );
  }, [onLocationFound]);

  const MapClickHandler = () => { useMapEvents({ click: (e) => onMapClick(e.latlng) }); return null; };

  return (
    <div className="h-96 w-full shadow-lg rounded-lg overflow-hidden">
      <MapContainer center={position} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* --- Conditionally render the NASA layer based on the prop --- */}
        {showNasaLayer && <NasaLayer />}

        <MapClickHandler />
        
        {userHasLocation && (
          <Marker position={position} icon={liveLocationIcon}>
            <Popup>You are here!</Popup>
          </Marker>
        )}
        
        {reports.map((report) => (
          <Marker key={report._id} position={[report.location.coordinates[1], report.location.coordinates[0]]}>
            <Popup>
              <strong>Status: {report.status}</strong><br/>
              {report.description}<br/>
              <small>By: {report.user?.name || 'N/A'}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;