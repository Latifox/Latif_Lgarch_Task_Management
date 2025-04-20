const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, admin } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.registerUser);

// Login a user
router.post('/login', userController.loginUser);

// Logout current session
router.post('/logout', auth, userController.logoutUser);

// Logout all sessions
router.post('/logoutAll', auth, userController.logoutAll);

// Get user profile
router.get('/me', auth, userController.getUserProfile);

// Update user profile
router.patch('/me', auth, userController.updateUserProfile);

// Delete user account
router.delete('/me', auth, userController.deleteUser);

module.exports = router; 