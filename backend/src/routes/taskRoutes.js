const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { auth } = require('../middleware/auth');

// Get all tasks
router.get('/', auth, taskController.getTasks);

// Get task by ID
router.get('/:id', auth, taskController.getTaskById);

// Create a task
router.post('/', auth, taskController.createTask);

// Update a task
router.patch('/:id', auth, taskController.updateTask);

// Delete a task
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router; 