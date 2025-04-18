import Task  from '../models/task.js';
import Project  from '../models/project.js';

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
  }
};

// Get tasks by project ID
const getTasksByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Check if project exists
    const project = await Project.getById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const tasks = await Task.getByProjectId(projectId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks for project:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.getById(taskId);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { project_id, name, description, start_date, end_date, progress, dependencies } = req.body;
    
    // Simple validation
    if (!project_id || !name || !start_date || !end_date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID, name, start date, and end date are required' 
      });
    }
    
    // Check if project exists
    const project = await Project.getById(project_id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    const taskId = await Task.create({
      project_id,
      name,
      description,
      start_date,
      end_date,
      progress: progress || 0,
      dependencies: dependencies || ''
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Task created successfully',
      data: { id: taskId }
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { name, description, start_date, end_date, progress, dependencies } = req.body;
    
    // Check if task exists
    const task = await Task.getById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    // Simple validation
    if (!name || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Name, start date, and end date are required' });
    }
    
    const success = await Task.update(taskId, {
      name,
      description,
      start_date,
      end_date,
      progress: progress !== undefined ? progress : task.progress,
      dependencies: dependencies !== undefined ? dependencies : task.dependencies
    });
    
    if (success) {
      res.json({ success: true, message: 'Task updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to update task' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Check if task exists
    const task = await Task.getById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    const success = await Task.delete(taskId);
    
    if (success) {
      res.json({ success: true, message: 'Task deleted successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to delete task' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, message: 'Failed to delete task', error: error.message });
  }
}; 

export { getAllTasks, getTasksByProjectId, getTaskById, createTask, updateTask, deleteTask };