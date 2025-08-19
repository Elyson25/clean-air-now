// client/src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post(`${API_URL}/api/users/forgotpassword`, { email }, config);
      toast.success('Password reset email sent! Please check your inbox (or Mailtrap for development).');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg max-w-md w-full mx-auto my-6 bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">Forgot Your Password?</h2>
      <p className="text-center text-gray-600 mb-4">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300">
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;