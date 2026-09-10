import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig'; // Import the central URL

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, { name, email, password }); // Use the central URL
      toast.success('Registration successful!');
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full">
      {/* Registration Form */}
      <form onSubmit={onSubmit}>
        
        {/* Full Name Input Group */}
        <div className="auth-input-group">
          <label className="auth-input-label">Name</label>
          <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="John Doe"
          />
        </div>

        {/* Email Address Input Group */}
        <div className="auth-input-group">
          <label className="auth-input-label">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Selection Input Group */}
        <div className="auth-input-group">
          <label className="auth-input-label">Password (min. 6 characters)</label>
          <input 
            type="password" 
            name="password" 
            minLength="6" 
            value={password} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="••••••••"
          />
        </div>

        {/* Password Confirmation Verification Input Group */}
        <div className="auth-input-group">
          <label className="auth-input-label">Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            minLength="6" 
            value={confirmPassword} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="••••••••"
          />
        </div>

        {/* High-Primary Registration Call Button */}
        <button type="submit" className="auth-action-btn btn-register-theme">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
