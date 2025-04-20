import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  // In a real app, these would come from context/state management
  const isAuthenticated = false;
  const userName = 'User';

  const handleLogout = () => {
    // In a real app, we would call logout API and clear tokens
    console.log('Logging out...');
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
              <span className="text-gray-700">Welcome, {userName}</span>
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