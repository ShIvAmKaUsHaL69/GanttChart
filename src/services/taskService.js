import api from './api';

const TaskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to fetch tasks' };
    }
  },
  
  // Get tasks by project ID
  getTasksByProjectId: async (projectId) => {
    try {
      const response = await api.get(`/tasks/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      return { success: false, message: error.response?.data?.message || 'Failed to fetch tasks' };
    }
  },
  
  // Get a task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      return { success: false, message: error.response?.data?.message || 'Failed to fetch task' };
    }
  },
  
  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create task' };
    }
  },
  
  // Update a task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      return { success: false, message: error.response?.data?.message || 'Failed to update task' };
    }
  },
  
  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete task' };
    }
  }
};

export default TaskService; 