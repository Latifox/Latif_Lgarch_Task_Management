import React from 'react';
import TaskStats from '../components/TaskStats';
import { TaskProvider } from '../context/TaskContext';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Task Dashboard</h1>
      
      <TaskProvider>
        <div className="grid grid-cols-1 gap-6">
          <TaskStats />
        </div>
      </TaskProvider>
    </div>
  );
};

export default Dashboard; 