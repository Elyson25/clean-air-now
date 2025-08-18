// client/src/components/MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import toast from 'react-hot-toast'; // Import toast for the notification

// FIX for default icon issue with React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// End of FIX

const MapComponent = ({ onMapClick, socket }) => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [reports, setReports] = useState([]);

  // Effect to fetch initial public reports
  useEffect(() => {
    const fetchPublicReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports/public');
        setReports(res.data);
      } catch (error) {
        console.error('Failed to fetch public reports:', error);
      }
    };
    fetchPublicReports();
  }, []);

  // Effect to listen for real-time updates
  useEffect(() => {
    if (socket) {
      console.log('MapComponent: Socket is available. Setting up listener for "newReport".');

      socket.on('newReport', (newReport) => {
        // --- THIS IS THE MOST IMPORTANT LOG ---
        console.log('<<<<< REAL-TIME EVENT RECEIVED! >>>>>', newReport);
        // --- END OF LOG ---
        
        toast.success('New incident reported nearby!');
        setReports(prevReports => [newReport, ...prevReports]);
      });
    }
    
    // Cleanup function to remove the listener
    return () => {
      if (socket) {
        console.log('MapComponent: Cleaning up "newReport" listener.');
        socket.off('newReport');
      }
    };
  }, [socket]);

  // Effect to get user's location (unchanged)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => console.log("Could not get user location, using default.")
    );
  }, []);

  const MapClickHandler = () => {
    useMapEvents({ click: (e) => onMapClick(e.latlng) });
    return null;
  };

  return (
    <div className="h-96 w-full shadow-lg rounded-lg overflow-hidden">
      <MapContainer center={position} zoom={10} style={{ height: '100%', width: '100%' }} key={position.toString()}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[report.location.coordinates[1], report.location.coordinates[0]]}
          >
            <Popup>
              <strong>Status: {report.status}</strong>
              <p>{report.description}</p>
              <small>Reported on: {new Date(report.createdAt).toLocaleDateString()}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;