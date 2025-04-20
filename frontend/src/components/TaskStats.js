import React, { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';

const TaskStats = () => {
  const { tasks, isLoading } = useTask();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    categories: {}
  });

  useEffect(() => {
    if (tasks.length > 0) {
      const newStats = {
        total: tasks.length,
        completed: 0,
        inProgress: 0,
        todo: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        categories: {}
      };

      tasks.forEach(task => {
        // Count by status
        if (task.status === 'completed') {
          newStats.completed++;
        } else if (task.status === 'in_progress') {
          newStats.inProgress++;
        } else if (task.status === 'todo') {
          newStats.todo++;
        }

        // Count by priority
        if (task.priority === 'high') {
          newStats.highPriority++;
        } else if (task.priority === 'medium') {
          newStats.mediumPriority++;
        } else if (task.priority === 'low') {
          newStats.lowPriority++;
        }

        // Count by category
        if (task.category) {
          if (!newStats.categories[task.category]) {
            newStats.categories[task.category] = 0;
          }
          newStats.categories[task.category]++;
        }
      });

      setStats(newStats);
    } else {
      setStats({
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        categories: {}
      });
    }
  }, [tasks]);

  if (isLoading) {
    return <div className="text-center py-4">Loading stats...</div>;
  }

  const calculatePercentage = (value) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Task Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Task Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>To Do</span>
              <span className="font-medium">{stats.todo} ({calculatePercentage(stats.todo)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: `${calculatePercentage(stats.todo)}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>In Progress</span>
              <span className="font-medium">{stats.inProgress} ({calculatePercentage(stats.inProgress)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${calculatePercentage(stats.inProgress)}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Completed</span>
              <span className="font-medium">{stats.completed} ({calculatePercentage(stats.completed)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${calculatePercentage(stats.completed)}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* Task Priority */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Priority</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>High</span>
              <span className="font-medium">{stats.highPriority} ({calculatePercentage(stats.highPriority)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${calculatePercentage(stats.highPriority)}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Medium</span>
              <span className="font-medium">{stats.mediumPriority} ({calculatePercentage(stats.mediumPriority)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${calculatePercentage(stats.mediumPriority)}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Low</span>
              <span className="font-medium">{stats.lowPriority} ({calculatePercentage(stats.lowPriority)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${calculatePercentage(stats.lowPriority)}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Categories</h3>
          {Object.keys(stats.categories).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span>{category}</span>
                  <span className="font-medium">{count} ({calculatePercentage(count)}%)</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No categories yet</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <span className="text-lg font-medium">Total Tasks: {stats.total}</span>
      </div>
    </div>
  );
};

export default TaskStats; 