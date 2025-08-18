// client/src/components/ForgotPasswordLink.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordLink = () => {
  return (
    <div className="text-right mt-2">
      <Link
        to="/forgot-password"
        className="text-sm text-blue-600 hover:underline"
      >
        Forgot Password?
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;