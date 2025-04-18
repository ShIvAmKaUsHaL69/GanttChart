import Project  from '../models/project.js';
import Task  from '../models/task.js';

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.getAll();
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects', error: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.getById(projectId);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Get all tasks for this project
    const tasks = await Task.getByProjectId(projectId);
    
    res.json({ 
      success: true, 
      data: {
        project,
        tasks
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project', error: error.message });
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date } = req.body;
    
    // Simple validation
    if (!name || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Name, start date, and end date are required' });
    }
    
    const projectId = await Project.create({
      name,
      description,
      start_date,
      end_date
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Project created successfully',
      data: { id: projectId }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project', error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, start_date, end_date } = req.body;
    
    // Check if project exists
    const project = await Project.getById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Simple validation
    if (!name || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Name, start date, and end date are required' });
    }
    
    const success = await Project.update(projectId, {
      name,
      description,
      start_date,
      end_date
    });
    
    if (success) {
      res.json({ success: true, message: 'Project updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to update project' });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, message: 'Failed to update project', error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Check if project exists
    const project = await Project.getById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Delete all tasks associated with the project first
    await Task.deleteByProjectId(projectId);
    
    // Then delete the project
    const success = await Project.delete(projectId);
    
    if (success) {
      res.json({ success: true, message: 'Project deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to delete project' });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project', error: error.message });
  }
}; 

export { getAllProjects, getProjectById, createProject, updateProject, deleteProject };