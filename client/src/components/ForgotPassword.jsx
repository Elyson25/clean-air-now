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
      // Preserved your exact API route signature matching your working backend controller
      await axios.post(`${API_URL}/api/users/forgotpassword`, { email }, config);
      toast.success('Password reset email sent! Please check your inbox (or Mailtrap for development).');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        
        {/* Unified Premium Header Layout */}
        <div className="auth-card-header">
          <h2>Forgot Your Password?</h2>
          <p>
            Enter your email and we'll send you a secure link to reset your account password.
          </p>
        </div>

        {/* Unified Premium Form Fields Container */}
        <div className="auth-form-body">
          <form onSubmit={onSubmit}>
            
            {/* Email Address Input Group */}
            <div className="auth-input-group" style={{ marginBottom: '1.5rem' }}>
              <label className="auth-input-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-premium-input"
                placeholder="you@example.com"
              />
            </div>

            {/* High-Impact Primary Submit Callout */}
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="auth-action-btn btn-register-theme"
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
