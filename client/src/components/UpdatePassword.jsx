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
    <div className="w-full">
      {/* Form for updating user password */}
      <form onSubmit={onSubmit}>
        
        {/* Current Password Field */}
        <div className="auth-input-group">
          <label className="auth-input-label">Current Password</label>
          <input 
            type="password" 
            name="oldPassword" 
            value={oldPassword} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="••••••••"
          />
        </div>

        {/* New Password Field */}
        <div className="auth-input-group">
          <label className="auth-input-label">New Password</label>
          <input 
            type="password" 
            name="newPassword" 
            value={newPassword} 
            onChange={onChange} 
            required 
            minLength="6" 
            className="auth-premium-input"
            placeholder="••••••••"
          />
        </div>

        {/* Confirm New Password Field */}
        <div className="auth-input-group" style={{ marginBottom: '1.5rem' }}>
          <label className="auth-input-label">Confirm New Password</label>
          <input 
            type="password" 
            name="confirmNewPassword" 
            value={confirmNewPassword} 
            onChange={onChange} 
            required 
            minLength="6" 
            className="auth-premium-input"
            placeholder="••••••••"
          />
        </div>

        {/* Premium Action Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="auth-action-btn btn-login-theme"
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Updating password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
