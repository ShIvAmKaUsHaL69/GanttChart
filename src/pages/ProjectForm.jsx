import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import ProjectService from '../services/projectService';

const ProjectForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { setProjects } = useOutletContext();
  
  const isEditMode = !!projectId;
  const formTitle = isEditMode ? 'Edit Project' : 'Create New Project';
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch project data if in edit mode
  useEffect(() => {
    const fetchProject = async () => {
      if (isEditMode) {
        try {
          const response = await ProjectService.getProjectById(projectId);
          
          if (response.success && response.data.project) {
            const { name, description, start_date, end_date } = response.data.project;
            setFormData({
              name,
              description: description || '',
              start_date: start_date.split('T')[0], // Format date for input
              end_date: end_date.split('T')[0]     // Format date for input
            });
          } else {
            setError('Failed to load project data');
          }
        } catch (err) {
          console.error('Error fetching project:', err);
          setError('An error occurred while loading the project');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [projectId, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.start_date || !formData.end_date) {
      setError('Name, start date, and end date are required');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      
      if (isEditMode) {
        // Update existing project
        response = await ProjectService.updateProject(projectId, formData);
      } else {
        // Create new project
        response = await ProjectService.createProject(formData);
      }
      
      if (response.success) {
        // Refresh projects in parent component
        const projectsResponse = await ProjectService.getAllProjects();
        if (projectsResponse.success) {
          setProjects(projectsResponse.data);
        }
        
        setSuccess(isEditMode ? 'Project updated successfully' : 'Project created successfully');
        
        // Redirect to project detail page if new project was created
        if (!isEditMode && response.data && response.data.id) {
          setTimeout(() => {
            navigate(`/projects/${response.data.id}`);
          }, 1500);
        }
      } else {
        setError(response.message || 'Failed to save project');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setError('An error occurred while saving the project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading project data...</div>;
  }

  return (
    <div className="project-form-container">
      <h2 className="page-title">{formTitle}</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form className="project-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Project Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            disabled={submitting}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="start_date">Start Date *</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            className="form-control"
            value={formData.start_date}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="end_date">End Date *</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            className="form-control"
            value={formData.end_date}
            onChange={handleChange}
            required
            disabled={submitting}
            min={formData.start_date} // End date must be after start date
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Project'}
          </button>
          
          <Link 
            to={isEditMode ? `/projects/${projectId}` : '/'}
            className="btn btn-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm; 