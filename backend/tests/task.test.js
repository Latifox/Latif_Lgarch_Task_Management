const mongoose = require('mongoose');
const Task = require('../src/models/Task');
const User = require('../src/models/User');

// Mock user ID for testing
const userId = new mongoose.Types.ObjectId();

// Sample task data
const taskData = {
  title: 'Test Task',
  description: 'This is a test task',
  status: 'todo',
  priority: 'medium',
  category: 'Testing',
  owner: userId
};

// Setup and teardown
beforeAll(async () => {
  // Connect to a test database if needed
  // await mongoose.connect('mongodb://localhost:27017/test-task-manager');
});

afterAll(async () => {
  // Disconnect from the test database
  // await mongoose.connection.close();
});

// Clear the database between tests
afterEach(async () => {
  // await Task.deleteMany({});
});

describe('Task Model Tests', () => {
  it('should create a new task', () => {
    const task = new Task(taskData);
    expect(task.title).toBe(taskData.title);
    expect(task.description).toBe(taskData.description);
    expect(task.status).toBe(taskData.status);
    expect(task.priority).toBe(taskData.priority);
    expect(task.category).toBe(taskData.category);
    expect(task.owner).toEqual(userId);
  });

  it('should require title field', async () => {
    const taskWithoutTitle = new Task({
      ...taskData,
      title: undefined
    });

    let error;
    try {
      await taskWithoutTitle.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.title).toBeDefined();
  });

  it('should only accept valid status values', () => {
    const invalidStatus = 'invalid_status';
    const taskWithInvalidStatus = new Task({
      ...taskData,
      status: invalidStatus
    });

    expect(taskWithInvalidStatus.validateSync().errors.status).toBeDefined();
  });

  it('should only accept valid priority values', () => {
    const invalidPriority = 'invalid_priority';
    const taskWithInvalidPriority = new Task({
      ...taskData,
      priority: invalidPriority
    });

    expect(taskWithInvalidPriority.validateSync().errors.priority).toBeDefined();
  });

  it('should have default status as todo', () => {
    const taskWithoutStatus = new Task({
      ...taskData,
      status: undefined
    });

    expect(taskWithoutStatus.status).toBe('todo');
  });

  it('should have default priority as medium', () => {
    const taskWithoutPriority = new Task({
      ...taskData,
      priority: undefined
    });

    expect(taskWithoutPriority.priority).toBe('medium');
  });

  it('should have default category as general', () => {
    const taskWithoutCategory = new Task({
      ...taskData,
      category: undefined
    });

    expect(taskWithoutCategory.category).toBe('general');
  });
}); 