// client/src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email: formData.email,
        password: formData.password,
      });
      
      toast.success('Login successful!');
      login(res.data); // Update context
      navigate('/dashboard'); // --- NAVIGATE AWAY ---

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-md w-full mx-auto my-6 bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">Login to Your Account</h2>
      <form onSubmit={onSubmit}>
        {/* ... form inputs ... */}
        <div className="mb-4">
          <label>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>
        <button type="submit" className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;