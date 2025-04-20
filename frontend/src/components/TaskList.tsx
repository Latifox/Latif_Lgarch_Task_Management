import React, { useState, useEffect } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';

interface TaskData {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      // This is a placeholder - in real app we'd call the API
      // const response = await fetch('/api/tasks');
      // const data = await response.json();
      
      // Using mock data for now
      const mockData: TaskData[] = [
        {
          _id: '1',
          title: 'Complete React frontend',
          description: 'Create components and implement routing',
          status: 'in_progress',
          priority: 'high',
          category: 'Development'
        },
        {
          _id: '2',
          title: 'Set up MongoDB database',
          description: 'Configure connection and test models',
          status: 'todo',
          priority: 'medium',
          category: 'DevOps'
        },
        {
          _id: '3',
          title: 'Write API documentation',
          description: 'Document all endpoints and parameters',
          status: 'todo',
          priority: 'low',
          category: 'Documentation'
        }
      ];
      
      setTasks(mockData);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setIsLoading(false);
    }
  };

  // Update task
  const handleUpdateTask = (id: string, updatedData: any) => {
    setTasks(tasks.map(task => 
      task._id === id ? { ...task, ...updatedData } : task
    ));
    
    // In a real app, we would make an API call to update the task
    // fetch(`/api/tasks/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(updatedData)
    // });
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task._id !== id));
    
    // In a real app, we would make an API call to delete the task
    // fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  };

  // Add new task
  const handleAddTask = (taskData: Omit<TaskData, '_id'>) => {
    const newTask = {
      _id: Date.now().toString(), // Mock ID
      ...taskData
    };
    
    setTasks([newTask, ...tasks]);
    setShowForm(false);
    
    // In a real app, we would make an API call to create the task
    // fetch('/api/tasks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(taskData)
    // });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) {
    return <div className="text-center p-6">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
          <TaskForm onSubmit={handleAddTask} />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center p-6 bg-gray-100 rounded">
          No tasks available. Start adding some!
        </div>
      ) : (
        <div>
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
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 