const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Récupérer toutes les tâches
export const getAllTasks = async (filters = {}) => {
  let url = `${API_URL}/api/tasks`;
  
  // Ajouter les filtres à l'URL s'ils existent
  if (Object.keys(filters).length > 0) {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        queryParams.append(key, value);
      }
    }
    
    url += `?${queryParams.toString()}`;
  }
  
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch tasks');
  }
  
  return data;
};

// Récupérer une tâche par son ID
export const getTaskById = async (taskId) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch task');
  }
  
  return data;
};

// Créer une nouvelle tâche
export const createTask = async (taskData) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create task');
  }
  
  return data;
};

// Mettre à jour une tâche
export const updateTask = async (taskId, taskData) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update task');
  }
  
  return data;
};

// Supprimer une tâche
export const deleteTask = async (taskId) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete task');
  }
  
  return true;
}; 