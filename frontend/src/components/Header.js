import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Task Manager
        </Link>
        
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="px-3 py-1 text-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                Tasks
              </Link>
              <Link 
                to="/dashboard"
                className="px-3 py-1 text-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-700">Welcome, {user?.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 rounded border border-red-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link 
                to="/login"
                className="px-3 py-1 text-blue-600 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 