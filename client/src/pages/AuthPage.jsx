import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
  // Use a state switch to toggle views dynamically inside one beautiful card
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        
        {/* ─── PORTAL INTERACTIVE HEADER ─── */}
        <div className="auth-card-header">
          <h2>{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {isLoginView 
              ? 'Enter your credentials to access the telemetry logs.' 
              : 'Join Clean Air Now to track and log community metrics.'}
          </p>
        </div>

        {/* ─── DYNAMIC CONTEXTUAL BODY ─── */}
        <div className="auth-form-body">
          {isLoginView ? <Login /> : <Register />}
          
          {/* Unified Footer Toggle Switch Links */}
          <div className="auth-toggle-footer">
            {isLoginView ? (
              <>
                Don't have an account?
                <button className="auth-toggle-link" onClick={() => setIsLoginView(false)}>
                  Register here
                </button>
              </>
            ) : (
              <>
                Already registered?
                <button className="auth-toggle-link" onClick={() => setIsLoginView(true)}>
                  Login here
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
