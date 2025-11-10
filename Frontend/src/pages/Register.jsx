import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { authAPI } from '../services/api';
import useAuthStore from '../store/authStore';

// Dark theme detection hook
const useDarkMode = () => {
  const [darkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  return darkMode;
};

const Register = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const darkMode = useDarkMode();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Combine names into fullName for the API
      const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();

      const response = await authAPI.registerUser({
        fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response && response.user) {
        // Store user data from API response
        login(response.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`
        min-h-screen
        flex items-center justify-center p-4
        bg-linear-to-br from-blue-50 via-white to-purple-50
        ${darkMode ? 'dark bg-linear-to-br dark:from-gray-900 dark:via-gray-950 dark:to-gray-800' : ''}
      `}
    >
      <div className="max-w-md w-full">
        <div className={`
          rounded-2xl shadow-xl p-8 space-y-6
          bg-white
          ${darkMode ? 'dark:bg-gray-900 dark:shadow-2xl' : ''}
        `}>
          <div className="text-center">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Create Account</h1>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Sign up to get started</p>
          </div>

          {error && (
            <div className={`
              px-4 py-3 rounded-lg
              ${darkMode
                ? 'bg-red-900 border border-red-700 text-red-200'
                : 'bg-red-50 border border-red-200 text-red-700'}
            `}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                icon={User}
                required
                className={darkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700' : ''}
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                icon={User}
                required
                className={darkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700' : ''}
              />
            </div>

            <Input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
              icon={UserCircle}
              className={darkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700' : ''}
            />

            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
              className={darkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700' : ''}
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
              className={darkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700' : ''}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Register
            </Button>
          </form>

          <div className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-semibold ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
