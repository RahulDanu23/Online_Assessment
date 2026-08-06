import React from 'react';
import { useNavigate } from 'react-router-dom';

function StudentProfile() {
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
          <h1 className="text-3xl font-extrabold text-gray-900">Student Profile</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-purple-900 mb-2">Welcome, {user.name}!</h2>
          <p className="text-purple-700">You are logged in as a Student.</p>
          <p className="text-sm text-purple-500 mt-4">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
