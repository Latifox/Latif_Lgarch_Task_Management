import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../../components/TaskList';
import { TaskProvider } from '../../context/TaskContext';
import { AuthProvider } from '../../context/AuthContext';

// Mock des services
jest.mock('../../services/taskService', () => ({
  getAllTasks: jest.fn().mockResolvedValue([
    { 
      _id: '1', 
      title: 'Test Task 1', 
      description: 'Description 1', 
      status: 'todo', 
      priority: 'medium',
      category: 'test' 
    },
    { 
      _id: '2', 
      title: 'Test Task 2', 
      description: 'Description 2', 
      status: 'in_progress', 
      priority: 'high',
      category: 'development' 
    }
  ]),
  createTask: jest.fn().mockResolvedValue({ 
    _id: '3', 
    title: 'New Task', 
    description: 'New Description', 
    status: 'todo', 
    priority: 'low',
    category: 'test' 
  }),
  deleteTask: jest.fn().mockResolvedValue({ success: true })
}));

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <TaskProvider>
        {ui}
      </TaskProvider>
    </AuthProvider>
  );
};

describe('TaskList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task list with mock data', async () => {
    renderWithProviders(<TaskList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('shows form when Add Task button is clicked', async () => {
    renderWithProviders(<TaskList />);
    
    fireEvent.click(screen.getByText('Add Task'));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });
  });

  test('allows adding a new task', async () => {
    renderWithProviders(<TaskList />);
    
    // Ouvrir le formulaire
    fireEvent.click(screen.getByText('Add Task'));
    
    // Remplir le formulaire
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: 'New Task' }
      });
      fireEvent.change(screen.getByLabelText(/Description/i), {
        target: { value: 'New Description' }
      });
    });
    
    // Soumettre le formulaire
    fireEvent.click(screen.getByText('Submit'));
    
    // Vérifier que la tâche a été ajoutée au DOM
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });
}); 