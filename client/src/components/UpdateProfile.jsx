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
    <div className="w-full">
      <form onSubmit={onSubmit}>
        
        {/* Full Name Input Group */}
        <div className="auth-input-group">
          <label className="auth-input-label">Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="Your name"
          />
        </div>
        
        {/* Email Address Input Group */}
        <div className="auth-input-group" style={{ marginBottom: '1.5rem' }}>
          <label className="auth-input-label">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="you@example.com"
          />
        </div>

        {/* Premium Action Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="auth-action-btn btn-register-theme"
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? 'Saving changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
