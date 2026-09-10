import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email: formData.email,
        password: formData.password,
      });
      toast.success('Login successful!');
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="w-full">
      {/* Login Form */}
      <form onSubmit={onSubmit}>
        
        {/* Email Address Input Group */}
        <div className="auth-input-group">
          <label className="auth-input-label">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="Enter your email address"
          />
        </div>
        
        {/* Password Input Group */}
        <div className="auth-input-group">
          <label className="auth-input-label">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={onChange} 
            required 
            className="auth-premium-input"
            placeholder="••••••••"
          />
        </div>

        {/* ─── CRUCIAL FORGOT PASSWORD ROUTING LINK ─── */}
        <div className="text-right" style={{ marginBottom: '1.5rem' }}>
          <Link to="/forgot-password" className="auth-forgot-link">
            Forgot Password?
          </Link>
        </div>

        {/* Premium Action Submit Button */}
        <button type="submit" className="auth-action-btn btn-login-theme">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
