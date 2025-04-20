const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/index');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

let token;
let userId;
let taskId;

beforeAll(async () => {
  // Connexion à la base de données de test
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  // Nettoyer la base de données avant les tests
  await User.deleteMany({});
  await Task.deleteMany({});
  
  // Créer un utilisateur de test et obtenir un token
  const userResponse = await request(app)
    .post('/api/users/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
  
  token = userResponse.body.token;
  userId = userResponse.body.user._id;
});

afterAll(async () => {
  // Nettoyer après les tests
  await User.deleteMany({});
  await Task.deleteMany({});
  
  // Fermer la connexion à la base de données
  await mongoose.connection.close();
});

describe('Task API Integration Tests', () => {
  
  test('Should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'This is a test task',
        status: 'todo',
        priority: 'medium',
        category: 'Test'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Test Task');
    
    taskId = response.body._id;
  });
  
  test('Should get all tasks', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });
  
  test('Should get a task by ID', async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(taskId);
    expect(response.body.title).toBe('Test Task');
  });
  
  test('Should update a task', async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'in_progress',
        priority: 'high'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('in_progress');
    expect(response.body.priority).toBe('high');
  });
  
  test('Should delete a task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    
    // Vérifier que la tâche a bien été supprimée
    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(getResponse.statusCode).toBe(404);
  });
  
  test('Should not access tasks without authentication', async () => {
    const response = await request(app)
      .get('/api/tasks');
    
    expect(response.statusCode).toBe(401);
  });
}); 