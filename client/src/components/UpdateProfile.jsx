import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';

const UpdateProfile = () => {
  const { user, token, login } = useAuth(); // We need login to update the user context
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill the form with the user's current details
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const res = await axios.put(`${API_URL}/api/users/profile`, formData, config);
      
      // Update the global user state with the new details
      login(res.data); 
      
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-md w-full bg-white">
      <h2 className="text-xl font-semibold mb-4">Update Details</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded"/>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded"/>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;