import React from 'react';
import { useAuth } from '../context/AuthContext';
import UpdateProfile from '../components/UpdateProfile';
import UpdatePassword from '../components/UpdatePassword';
import FavoriteLocations from '../components/FavoriteLocations';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        My Profile
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Manage your account details and alert locations.
      </p>

      {/* --- RESPONSIVE LAYOUT CHANGES --- */}
      {/* On mobile, it's a single-column layout. On large screens, it's a 3-column grid. */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: User Details & Password */}
        {/* On large screens, this group spans 1 of the 3 columns */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <UpdateProfile />
          <UpdatePassword />
        </div>

        {/* Column 2: Favorite Locations */}
        {/* On large screens, this component spans 2 of the 3 columns for more space */}
        <div className="lg:col-span-2">
          <FavoriteLocations />
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;