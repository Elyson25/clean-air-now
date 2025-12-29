// client/src/components/AdminUsersTable.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { API_URL } from '../apiConfig';

const AdminUsersTable = () => {
  const { token, user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllUsers = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/api/users`, config);
      setUsers(res.data.filter(user => user._id !== adminUser._id));
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if adminUser is available before fetching
    if (adminUser?._id) {
      fetchAllUsers();
    }
  }, [token, adminUser]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) {
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/api/users/${userId}`, config);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (isLoading) return <p className="text-center p-4">Loading users...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg my-6">
      <h2 className="text-xl font-semibold p-4 border-b">All Registered Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Is Admin</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.isAdmin ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-4 text-center">No other users found.</p>}
      </div>
    </div>
  );
};

export default AdminUsersTable;