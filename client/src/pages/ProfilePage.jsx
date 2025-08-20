import React from 'react';
import { useAuth } from '../context/AuthContext';
import UpdateProfile from '../components/UpdateProfile';
import UpdatePassword from '../components/UpdatePassword';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        My Profile
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Manage your account details for <strong>{user.email}</strong>
      </p>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* We will create these two components next */}
        <UpdateProfile />
        <UpdatePassword />
      </div>
    </div>
  );
};

export default ProfilePage;