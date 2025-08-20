// client/src/pages/AuthPage.jsx
import React from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthPage = () => {
  return (
    // On mobile, items are in a column. On medium screens and up, they are side-by-side.
    <div className="flex flex-col md:flex-row justify-center items-start gap-8 p-4">
      <Register />
      <Login />
    </div>
  );
};

export default AuthPage;