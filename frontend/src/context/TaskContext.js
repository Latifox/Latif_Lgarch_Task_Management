import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { getAllTasks, createTask, updateTask as updateTaskApi, deleteTask } from '../services/taskService';
import { useAuth } from './AuthContext';

// Création du contexte
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, token } = useAuth();
  const fetchTimeoutRef = useRef(null);

  // Récupérer toutes les tâches avec debounce
  const fetchTasks = useCallback(async () => {
    // Clear any existing timeout to prevent multiple calls
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  // Charger les tâches au démarrage et quand l'authentification change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
    }
    
    // Cleanup function to clear timeout on unmount
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [isAuthenticated, fetchTasks]);

  // Ajouter une tâche
  const addTask = async (taskData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newTask = await createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une tâche
  const updateTask = async (taskId, taskData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedTask = await updateTaskApi(taskId, taskData);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
      
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une tâche
  const removeTask = async (taskId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      
      return true;
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Valeurs à exposer dans le contexte
  const value = {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    removeTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;