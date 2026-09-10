import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig'; // Import the central URL

const ReportForm = ({ mapClickCoords }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    latitude: '',
    longitude: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { description, latitude, longitude } = formData;

  useEffect(() => {
    if (mapClickCoords) {
      setFormData(prevData => ({
        ...prevData,
        latitude: mapClickCoords.lat.toFixed(5),
        longitude: mapClickCoords.lng.toFixed(5),
      }));
      toast.success('Location selected from map.');
    }
  }, [mapClickCoords]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success('Current location captured.');
        },
        (error) => toast.error(`Error getting location: ${error.message}`)
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const body = JSON.stringify({ description, latitude, longitude });
      await axios.post(`${API_URL}/api/reports`, body, config); // Use the central URL
      toast.success('Report submitted successfully!');
      setFormData({ description: '', latitude: '', longitude: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Form Header Section */}
      <form onSubmit={onSubmit}>
        
        {/* Incident Description Area */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="auth-input-label">Description</label>
          <textarea 
            name="description" 
            value={description} 
            onChange={onChange} 
            required 
            rows="4" 
            className="user-premium-textarea" 
            placeholder="Describe the environmental incident (e.g. fire, heavy smoke, dust)..."
          ></textarea>
        </div>

        {/* Geolocation Meta Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="auth-input-label">Location Coordinates</label>
          
          {/* Capture Geolocation Control Button */}
          <button 
            type="button" 
            onClick={handleUseMyLocation} 
            className="btn-geo-locator"
          >
            📍 Use My Current Location
          </button>
          
          {/* Asymmetrical Coordinate Fields Split (Adapts perfectly to all smartphone screens) */}
          <div className="geo-inputs-flex">
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Latitude</span>
              <input 
                type="number" 
                name="latitude" 
                value={latitude} 
                onChange={onChange} 
                required 
                placeholder="0.00000" 
                className="auth-premium-input" 
                style={{ marginTop: '0.25rem' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Longitude</span>
              <input 
                type="number" 
                name="longitude" 
                value={longitude} 
                onChange={onChange} 
                required 
                placeholder="0.00000" 
                className="auth-premium-input" 
                style={{ marginTop: '0.25rem' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Incident Report Button Action */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="btn-report-submit"
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Syncing submission...' : 'Submit Alert Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
