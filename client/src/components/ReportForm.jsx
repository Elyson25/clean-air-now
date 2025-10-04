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
    <div className="border border-gray-300 p-5 rounded-lg max-w-lg mx-auto my-6 bg-white">
      <h3 className="text-xl font-semibold mb-2">Report an Air Quality Incident</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={description} onChange={onChange} required rows="4" className="w-full p-2 border border-gray-300 rounded" placeholder="Describe the incident..."></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Location of Incident</label>
          <button type="button" onClick={handleUseMyLocation} className="w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Use My Current Location
          </button>
          <div className="flex gap-2">
            <input type="number" name="latitude" value={latitude} onChange={onChange} required placeholder="Latitude" className="w-1/2 p-2 border border-gray-300 rounded" />
            <input type="number" name="longitude" value={longitude} onChange={onChange} required placeholder="Longitude" className="w-1/2 p-2 border border-gray-300 rounded" />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300">
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;