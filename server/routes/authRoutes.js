import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login route
router.post('/login', authController.login);

// Get current user
router.get('/me', authenticateToken, authController.getCurrentUser);

// Change password
router.post('/change-password', authenticateToken, authController.changePassword);

export default router; 