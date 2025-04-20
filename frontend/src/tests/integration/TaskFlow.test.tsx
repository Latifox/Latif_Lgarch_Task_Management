import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../../App';

// Mock des APIs
jest.mock('../../services/api', () => ({
  fetchTasks: jest.fn().mockResolvedValue([
    { _id: '1', title: 'Task 1', status: 'todo', priority: 'high', createdAt: new Date().toISOString() },
    { _id: '2', title: 'Task 2', status: 'in_progress', priority: 'medium', createdAt: new Date().toISOString() }
  ]),
  createTask: jest.fn().mockImplementation((task) => 
    Promise.resolve({ ...task, _id: '3', createdAt: new Date().toISOString() })
  ),
  updateTask: jest.fn().mockImplementation((id, task) => 
    Promise.resolve({ ...task, _id: id, updatedAt: new Date().toISOString() })
  ),
  deleteTask: jest.fn().mockResolvedValue({ success: true })
}));

// Configuration du store Redux
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Task Flow Integration Tests', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        token: 'fake-token',
        user: { _id: 'user1', name: 'Test User' },
        isAuthenticated: true
      },
      tasks: {
        tasks: [
          { _id: '1', title: 'Task 1', status: 'todo', priority: 'high', createdAt: new Date().toISOString() },
          { _id: '2', title: 'Task 2', status: 'in_progress', priority: 'medium', createdAt: new Date().toISOString() }
        ],
        loading: false,
        error: null
      }
    });
  });

  test('Full task lifecycle: view, create, edit, delete', async () => {
    // Render the app
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );

    // Verify tasks are displayed
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Task 2')).toBeInTheDocument();

    // Test creating a new task
    fireEvent.click(screen.getByText('Add New Task'));
    
    await waitFor(() => {
      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
    
    // Fill in the form
    userEvent.type(screen.getByLabelText('Title'), 'Test New Task');
    userEvent.type(screen.getByLabelText('Description'), 'This is a new task created in the test');
    
    // Select status and priority
    const statusSelect = screen.getByLabelText('Status');
    userEvent.selectOptions(statusSelect, 'todo');
    
    const prioritySelect = screen.getByLabelText('Priority');
    userEvent.selectOptions(prioritySelect, 'high');
    
    // Submit the form
    fireEvent.click(screen.getByText('Create Task'));
    
    // Verify the new action dispatched to the store
    const actions = store.getActions();
    await waitFor(() => {
      const createActions = actions.filter(action => 
        action.type.includes('CREATE_TASK'));
      expect(createActions.length).toBeGreaterThan(0);
    });
    
    // Test editing a task
    fireEvent.click(screen.getAllByText('Edit')[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });
    
    // Change task status
    const editStatusSelect = screen.getByLabelText('Status');
    userEvent.selectOptions(editStatusSelect, 'completed');
    
    // Submit the update
    fireEvent.click(screen.getByText('Update Task'));
    
    // Verify the update action dispatched to the store
    await waitFor(() => {
      const updateActions = actions.filter(action => 
        action.type.includes('UPDATE_TASK'));
      expect(updateActions.length).toBeGreaterThan(0);
    });
    
    // Test deleting a task
    fireEvent.click(screen.getAllByText('Delete')[0]);
    
    // Confirm deletion in a separate step from the waitFor
    const confirmButton = await waitFor(() => screen.getByText('Confirm'));
    fireEvent.click(confirmButton);
    
    // Verify the delete action dispatched to the store
    await waitFor(() => {
      const deleteActions = actions.filter(action => 
        action.type.includes('DELETE_TASK'));
      expect(deleteActions.length).toBeGreaterThan(0);
    });
  });
}); 