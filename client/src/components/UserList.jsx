import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserList = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Automatically parse your live production backend URL from Vercel's environments configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get(`${API_BASE_URL}/api/users`, config);
        setUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [token, API_BASE_URL]);

  return (
    <div className="w-full">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <div className="h-6 w-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-400 animate-pulse">Fetching operator keys...</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="divide-y divide-slate-100 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 group transition-all">
              
              {/* Profile Meta Left Block */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Dynamically assigned colorful user circle icon */}
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${
                  user.role === 'admin' || user.isAdmin
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm' 
                    : 'bg-slate-50 border-slate-200/60 text-slate-600'
                }`}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                
                {/* Profile text data stack with auto truncating to prevent layout break */}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-700 truncate group-hover:text-slate-900 transition-colors">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-400 truncate font-medium">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Status Security Badge Right Block */}
              <div className="ml-2 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-sm transition-all ${
                  user.role === 'admin' || user.isAdmin
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border-slate-200/50'
                }`}>
                  {user.role === 'admin' || user.isAdmin ? 'Admin' : 'Operator'}
                </span>
              </div>

            </div>
          ))}

          {/* Fallback Empty Database State */}
          {users.length === 0 && (
            <div className="text-center py-8 text-xs font-medium text-slate-400">
              No registered user profiles found in the registry.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
