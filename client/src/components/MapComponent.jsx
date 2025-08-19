// client/src/components/MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import toast from 'react-hot-toast';

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

// Define our custom blue dot icon
const liveLocationIcon = new L.divIcon({
  className: 'live-location-icon',
  iconSize: [18, 18],
});

// Helper component to recenter the map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({ onMapClick, socket, onLocationFound }) => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [reports, setReports] = useState([]);
  const [zoom, setZoom] = useState(5);
  const [userHasLocation, setUserHasLocation] = useState(false);

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

  // Effect to listen for real-time updates from Socket.IO
  useEffect(() => {
    if (socket) {
      socket.on('newReport', (newReport) => {
        toast.success('New incident reported!');
        setReports(prevReports => [newReport, ...prevReports]);
      });
    }
    return () => {
      if (socket) {
        socket.off('newReport');
      }
    };
  }, [socket]);

  // Effect to get the user's initial location with high accuracy
  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition([newPos.lat, newPos.lng]);
        setZoom(13);
        setUserHasLocation(true);
        toast.success("Your location has been found!");
        if (onLocationFound) {
          onLocationFound(newPos);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location access was denied. Please enable it in your browser settings.");
        } else {
          toast.error("Could not get your location. Please ensure location services are on.");
        }
      },
      options
    );
  }, [onLocationFound]);

  // Helper component to handle map click events
  const MapClickHandler = () => {
    useMapEvents({ click: (e) => onMapClick(e.latlng) });
    return null;
  };

  return (
    <div className="h-96 w-full shadow-lg rounded-lg overflow-hidden">
      <MapContainer center={position} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {userHasLocation && (
          <Marker position={position} icon={liveLocationIcon}>
            <Popup>You are here! (Approximate location)</Popup>
          </Marker>
        )}
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[report.location.coordinates[1], report.location.coordinates[0]]}
          >
            <Popup>
              <strong>Status: {report.status}</strong>
              <p>{report.description}</p>
              <p>Reported by: {report.user ? report.user.name : 'Anonymous'}</p>
              <small>Submitted on: {new Date(report.createdAt).toLocaleDateString()}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;