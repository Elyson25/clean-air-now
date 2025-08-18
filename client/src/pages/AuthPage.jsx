// src/pages/AuthPage.jsx
import React from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px' }}>
      <Register />
      <Login />
    </div>
  );
};

export default AuthPage;