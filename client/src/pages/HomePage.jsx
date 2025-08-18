import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h2 className="text-4xl font-extrabold text-gray-800 mt-10">Welcome to Clean Air Now</h2>
      <p className="text-lg text-gray-600 mt-4 max-w-2xl">
        Your source for real-time air quality monitoring and community-driven incident reporting.
      </p>
      <Link to="/auth" className="mt-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300">
          Login or Register
        </button>
      </Link>
    </div>
  );
};

export default HomePage;