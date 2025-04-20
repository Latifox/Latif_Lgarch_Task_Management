import React from 'react';

interface TaskProps {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({
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
  const getStatusColor = () => {
    switch (status) {
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(id, { status: e.target.value });
  };

  return (
    <div className={`p-4 mb-3 rounded shadow ${getStatusColor()}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex space-x-2">
          <select
            value={status}
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