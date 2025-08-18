import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ReportForm = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ description: '', latitude: '', longitude: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { description, latitude, longitude } = formData;
  
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          toast.success('Location captured successfully.');
        },
        (error) => {
          toast.error(`Error getting location: ${error.message}`);
        }
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
      await axios.post('http://localhost:5000/api/reports', body, config);
      toast.success('Report submitted successfully!');
      setFormData({ description: '', latitude: '', longitude: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Report an Air Quality Incident</h3>
      <p className="text-sm text-gray-600 mb-6">Spotted illegal burning or unusual pollution? Let us know.</p>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={description} onChange={onChange} required rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the incident..."></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Location of Incident</label>
          <button type="button" onClick={handleUseMyLocation} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-2 transition-colors duration-200">Use My Current Location</button>
          <div className="flex gap-4">
            <input type="number" step="any" name="latitude" value={latitude} onChange={onChange} required placeholder="Latitude" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            <input type="number" step="any" name="longitude" value={longitude} onChange={onChange} required placeholder="Longitude" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-red-300">
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;