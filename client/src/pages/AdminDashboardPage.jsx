import React from 'react';
import UserList from '../components/UserList';
import ReportManager from '../components/ReportManager';

const AdminDashboardPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        
        {/* Render the components */}
        <UserList />
        <ReportManager />
      </div>
    </div>
  );
};

export default AdminDashboardPage;