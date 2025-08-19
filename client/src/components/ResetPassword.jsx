// client/src/components/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';
import { useAuth } from '../context/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setIsSubmitting(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/users/resetpassword/${resettoken}`,
        { password }
      );
      toast.success('Password reset successfully!');
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-md w-full mx-auto my-6 bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">Reset Your Password</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label>New Password (min. 6 characters)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" className="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <div className="mb-4">
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6" className="w-full p-2 border border-gray-300 rounded mt-1" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300">
          {isSubmitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;