// client/src/pages/AdminPage.jsx
import React from 'react';
import AdminReportsTable from '../components/AdminReportsTable'; // Import the new component

const AdminPage = () => {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      
      {/* Render the reports table component */}
      <AdminReportsTable />
      
      {/* We can add the AdminUsersTable here later */}
    </div>
  );
};

export default AdminPage;