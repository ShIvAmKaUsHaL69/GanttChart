import express from 'express';
import * as taskController from '../controllers/taskController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks
router.get('/', authenticateToken, taskController.getAllTasks);

// Get tasks by project ID
router.get('/project/:projectId', authenticateToken, taskController.getTasksByProjectId);

// Get a single task by ID
router.get('/:id', authenticateToken, taskController.getTaskById);

// Create a new task (admin only)
router.post('/', authenticateToken, requireAdmin, taskController.createTask);

// Update a task (admin only)
router.put('/:id', authenticateToken, requireAdmin, taskController.updateTask);

// Delete a task (admin only)
router.delete('/:id', authenticateToken, requireAdmin, taskController.deleteTask);

export default router; 