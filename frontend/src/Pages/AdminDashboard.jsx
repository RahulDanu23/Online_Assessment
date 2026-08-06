import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">Welcome, {user.name}!</h2>
          <p className="text-indigo-700">You are logged in as an Administrator.</p>
          <p className="text-sm text-indigo-500 mt-4">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
