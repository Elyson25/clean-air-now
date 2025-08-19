// client/src/components/ReportForm.jsx
import React, { useState, useEffect } from 'react'; // Add useEffect
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// The component now accepts a prop for map coordinates
const ReportForm = ({ mapClickCoords }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    latitude: '',
    longitude: '',
  });
  // ... (other state variables are unchanged)
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { description, latitude, longitude } = formData;

  // --- NEW: useEffect to update form when map is clicked ---
  useEffect(() => {
    if (mapClickCoords) {
      setFormData(prevData => ({
        ...prevData,
        latitude: mapClickCoords.lat.toFixed(5), // Format for display
        longitude: mapClickCoords.lng.toFixed(5),
      }));
      setMessage('Location selected from map.');
      setIsError(false);
    }
  }, [mapClickCoords]); // This effect runs whenever mapClickCoords changes

  // ... (the rest of the component's functions: onChange, handleUseMyLocation, onSubmit are all unchanged)
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseMyLocation = () => { /* ... same as before ... */ 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setMessage('Location captured successfully.');
          setIsError(false);
        },
        (error) => {
          setMessage(`Error getting location: ${error.message}`);
          setIsError(true);
        }
      );
    } else {
      setMessage('Geolocation is not supported by your browser.');
      setIsError(true);
    }
  };

  const onSubmit = async (e) => { /* ... same as before ... */ 
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const body = JSON.stringify({ description, latitude, longitude });
      await axios.post('http://localhost:5000/api/reports', body, config);
      setMessage('Report submitted successfully!');
      setIsError(false);
      setFormData({ description: '', latitude: '', longitude: '' });
    } catch (err) {
      setMessage(err.response.data.message || 'Failed to submit report.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // The JSX/render part is unchanged
  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-lg mx-auto my-10 bg-white">
      <h3 className="text-xl font-semibold mb-2">Report an Air Quality Incident</h3>
      <p className="text-gray-600 mb-4">Spotted illegal burning or unusual pollution? Let us know.</p>
      <form onSubmit={onSubmit}>
        {/* ... Form JSX is unchanged, but you can replace inline styles with Tailwind classes if you like ... */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            required
            rows="4"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Describe the incident..."
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Location of Incident (Click map or use button)</label>
          <button type="button" onClick={handleUseMyLocation} className="w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Use My Current Location
          </button>
          <div className="flex gap-2">
            <input
              type="number"
              name="latitude"
              value={latitude}
              onChange={onChange}
              required
              placeholder="Latitude"
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="longitude"
              value={longitude}
              onChange={onChange}
              required
              placeholder="Longitude"
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300">
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ReportForm;