import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Task from '../Task';

describe('Task Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'todo' as const,
    priority: 'medium' as const,
    category: 'Testing',
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
    mockOnDelete.mockClear();
  });

  test('renders task title correctly', () => {
    render(
      <Task
        {...mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
  });

  test('renders task description correctly', () => {
    render(
      <Task
        {...mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });

  test('calls onUpdate when status is changed', () => {
    render(
      <Task
        {...mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'in_progress' } });
    
    expect(mockOnUpdate).toHaveBeenCalledWith('1', { status: 'in_progress' });
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <Task
        {...mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
}); 