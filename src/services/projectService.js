import api from './api';

const ProjectService = {
  // Get all projects
  getAllProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to fetch projects' };
    }
  },
  
  // Get a project by ID with its tasks
  getProjectById: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${projectId}:`, error);
      return { success: false, message: error.response?.data?.message || 'Failed to fetch project' };
    }
  },
  
  // Create a new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to create project' };
    }
  },
  
  // Update a project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${projectId}:`, error);
      return { success: false, message: error.response?.data?.message || 'Failed to update project' };
    }
  },
  
  // Delete a project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete project' };
    }
  }
};

export default ProjectService; 