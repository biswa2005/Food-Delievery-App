import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';

const Homepage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
  // Keep theme detection but remove toggler
  const [darkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Check authentication on mount
    const isAuth = checkAuth();
    if (!isAuth) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove handleToggleTheme and theme toggle button

  const handleLogout = async () => {
    try {
      await authAPI.logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      logout();
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div
      className={`
        min-h-screen 
        bg-linear-to-br from-blue-50 via-white to-purple-50
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800
        ${darkMode ? 'dark' : ''}
      `}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="
          bg-white dark:bg-gray-900
          rounded-2xl shadow-xl p-8
          transition-colors duration-300
        ">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Homepage</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Welcome, {user?.fullName || user?.name || user?.email || 'User'}!
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleLogout}
                variant="secondary"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center transition-colors duration-300">
              <p className="text-gray-600 dark:text-gray-200 text-lg">
                Your content will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

