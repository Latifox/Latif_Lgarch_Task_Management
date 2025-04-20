import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskList from './components/TaskList';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';

const App: React.FC = () => {
  // In a real app, this would be managed by a context/state management
  const isAuthenticated = false;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <Routes>
            <Route 
              path="/"
              element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 