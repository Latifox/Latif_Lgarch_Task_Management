import React, { useState, useRef } from 'react';

const Task = ({
  id,
  title,
  description,
  status,
  priority,
  category,
  dueDate,
  onUpdate,
  onDelete
}) => {
  const [localStatus, setLocalStatus] = useState(status);
  const statusTimeoutRef = useRef(null);

  const getStatusColor = () => {
    switch (localStatus) {
      case 'todo':
        return 'bg-gray-200';
      case 'in_progress':
        return 'bg-blue-200';
      case 'completed':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setLocalStatus(newStatus);
    
    // Clear any existing timeout
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    
    // Set a new timeout to debounce the API call
    statusTimeoutRef.current = setTimeout(() => {
      onUpdate(id, { status: newStatus });
    }, 500); // 500ms debounce
  };

  return (
    <div className={`p-4 mb-3 rounded shadow ${getStatusColor()}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex space-x-2">
          <select
            value={localStatus}
            onChange={handleStatusChange}
            className="px-2 py-1 rounded border border-gray-300"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => onDelete(id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      
      {description && <p className="mt-2 text-gray-700">{description}</p>}
      
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`font-medium ${getPriorityColor()}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </span>
        <span className="text-gray-600">Category: {category}</span>
        {dueDate && (
          <span className="text-gray-600">
            Due: {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default Task; 