import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="portal-hero-section">
      {/* Premium Bold Header Element */}
      <h1 className="portal-hero-title">
        Welcome to Clean Air Now
      </h1>
      
      {/* Structured Subtitle Metadata */}
      <p className="portal-hero-subtitle">
        Your source for real-time air quality monitoring and community-driven incident reporting.
      </p>
      
      {/* High-Impact Animated Action Link */}
      <Link to="/auth" className="premium-portal-btn">
        Login or Register
      </Link>
    </div>
  );
};

export default HomePage;
