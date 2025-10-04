import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';
import { OpenStreetMapProvider } from 'leaflet-geosearch'; // Import the geocoding provider

const FavoriteLocations = () => {
  const { token } = useAuth();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newLocationName, setNewLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const geocodeProvider = new OpenStreetMapProvider();

  // Fetch existing favorite locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${API_URL}/api/locations`, config);
        setLocations(res.data);
      } catch (error) {
        toast.error('Could not fetch saved locations.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, [token]);

  // Handler for adding a new location
  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocationName || !address) {
      return toast.error('Please provide a name and an address.');
    }
    setIsSubmitting(true);
    try {
      // 1. Convert address to coordinates
      const results = await geocodeProvider.search({ query: address });
      if (results.length === 0) {
        throw new Error('Could not find coordinates for this address.');
      }
      const { y: latitude, x: longitude } = results[0]; // y is latitude, x is longitude

      // 2. Send the new location to the backend
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const body = { name: newLocationName, latitude, longitude };
      const res = await axios.post(`${API_URL}/api/locations`, body, config);
      
      setLocations(res.data); // Update state with the new list from the server
      setNewLocationName('');
      setAddress('');
      toast.success('Location added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add location.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for deleting a location
  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.delete(`${API_URL}/api/locations/${locationId}`, config);
      setLocations(res.data); // Update state with the new list
      toast.success('Location deleted.');
    } catch (err) {
      toast.error('Failed to delete location.');
    }
  };

  if (isLoading) return <p>Loading your favorite locations...</p>;

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-lg w-full mx-auto my-6 bg-white">
      <h2 className="text-xl font-semibold mb-4">My Alert Locations</h2>
      <p className="text-sm text-gray-600 mb-4">
        Add locations to receive email alerts when the air quality becomes poor (AQI ≥ 4).
      </p>

      {/* Form for adding a new location */}
      <form onSubmit={handleAddLocation} className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2">Add a New Location</h3>
        <div className="mb-2">
          <label className="block text-sm">Location Name (e.g., Home, Work)</label>
          <input type="text" value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div className="mb-2">
          <label className="block text-sm">Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300">
          {isSubmitting ? 'Adding...' : 'Add Location'}
        </button>
      </form>

      {/* List of saved locations */}
      <div>
        <h3 className="font-semibold mb-2">Saved Locations</h3>
        {locations.length === 0 ? (
          <p className="text-gray-500">You have no saved locations.</p>
        ) : (
          <ul className="list-none p-0">
            {locations.map((loc) => (
              <li key={loc._id} className="flex justify-between items-center p-2 border-b last:border-0">
                <span>{loc.name}</span>
                <button onClick={() => handleDeleteLocation(loc._id)} className="text-red-500 hover:text-red-700 text-sm">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FavoriteLocations;