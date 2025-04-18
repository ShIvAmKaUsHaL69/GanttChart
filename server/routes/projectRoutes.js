import express from 'express';
import * as projectController from '../controllers/projectController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, projectController.getAllProjects);

// Get a single project by ID with its tasks
router.get('/:id', authenticateToken, projectController.getProjectById);

// Create a new project (admin only)
router.post('/', authenticateToken, requireAdmin, projectController.createProject);

// Update a project (admin only)
router.put('/:id', authenticateToken, requireAdmin, projectController.updateProject);

// Delete a project (admin only)
router.delete('/:id', authenticateToken, requireAdmin, projectController.deleteProject);

export default router; 