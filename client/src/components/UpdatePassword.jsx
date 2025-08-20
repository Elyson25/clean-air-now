// client/src/components/UpdatePassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../apiConfig';

const UpdatePassword = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { oldPassword, newPassword, confirmNewPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return toast.error('New passwords do not match');
    }
    setIsSubmitting(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/api/users/updatepassword`, { oldPassword, newPassword }, config);
      
      toast.success('Password updated successfully!');
      setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear form
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-md w-full bg-white">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Current Password</label>
          <input type="password" name="oldPassword" value={oldPassword} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded"/>
        </div>
        <div className="mb-4">
          <label className="block mb-1">New Password</label>
          <input type="password" name="newPassword" value={newPassword} onChange={onChange} required minLength="6" className="w-full p-2 border border-gray-300 rounded"/>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Confirm New Password</label>
          <input type="password" name="confirmNewPassword" value={confirmNewPassword} onChange={onChange} required minLength="6" className="w-full p-2 border border-gray-300 rounded"/>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300">
          {isSubmitting ? 'Saving...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;