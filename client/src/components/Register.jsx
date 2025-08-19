// client/src/components/Register.jsx
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
    <div className="border border-gray-300 p-5 rounded-lg max-w-md w-full mx-auto my-6 bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">Create an Account</h2>
      <form onSubmit={onSubmit}>
        {/* ... form inputs (name, email, password, confirmPassword) ... */}
        <div className="mb-4">
          <label>Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>
        <div className="mb-4">
          <label>Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>
        <div className="mb-4">
          <label>Password (min. 6 characters)</label>
          <input type="password" name="password" minLength="6" value={password} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>
        <div className="mb-4">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" minLength="6" value={confirmPassword} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;