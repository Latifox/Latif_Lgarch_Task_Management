import React, { useState, useEffect, useCallback } from 'react';
import Task from './Task';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';

const TaskList = () => {
  const { isAuthenticated } = useAuth();
  const { tasks, isLoading, error, fetchTasks, addTask, updateTask, removeTask } = useTask();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'General'
  });

  // Fetch tasks when component mounts - only once when authenticated
  useEffect(() => {
    let mounted = true;
    
    if (isAuthenticated && mounted) {
      // Only fetch tasks if we don't already have them
      if (tasks.length === 0 && !isLoading) {
        fetchTasks();
      }
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, fetchTasks, tasks.length, isLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Memoize the handleAddTask function to prevent unnecessary re-renders
  const handleAddTask = useCallback((e) => {
    e.preventDefault();
    
    if (editingTask) {
      // Update existing task
      updateTask(editingTask, formData);
      setEditingTask(null);
    } else {
      // Add new task
      addTask(formData);
    }
    
    // Reset form
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category: 'General'
    });
  }, [editingTask, formData, updateTask, addTask]);

  const handleEditTask = useCallback((task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      category: task.category
    });
    setEditingTask(task._id);
    setShowForm(true);
  }, []);

  const handleDeleteTask = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      removeTask(id);
    }
  }, [removeTask]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100';
      case 'in_progress': return 'bg-blue-100';
      case 'completed': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'text-green-700';
      case 'medium': return 'text-yellow-700';
      case 'high': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  if (isLoading && tasks.length === 0) {
    return <div className="text-center py-6">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-6">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <button
          onClick={() => {
            if (!showForm) {
              setFormData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                category: 'General'
              });
              setEditingTask(null);
            }
            setShowForm(!showForm);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <form onSubmit={handleAddTask}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {tasks.length === 0 ? (
        <div className="text-center py-10 bg-white rounded shadow">
          <p className="text-gray-500">You don't have any tasks yet. Add your first task to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map(task => (
            <Task
              key={task._id}
              id={task._id}
              title={task.title}
              description={task.description}
              status={task.status}
              priority={task.priority}
              category={task.category}
              dueDate={task.dueDate}
              onUpdate={updateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 