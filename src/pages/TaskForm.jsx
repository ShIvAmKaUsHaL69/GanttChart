import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProjectService from '../services/projectService';
import TaskService from '../services/taskService';

const TaskForm = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  
  const isEditMode = !!taskId;
  const formTitle = isEditMode ? 'Edit Task' : 'Create New Task';
  
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    progress: 0,
    dependencies: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch project and task data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the project
        const projectResponse = await ProjectService.getProjectById(projectId);
        
        if (projectResponse.success) {
          setProject(projectResponse.data.project);
          setProjectTasks(projectResponse.data.tasks);
          
          // Set default dates based on project if not in edit mode
          if (!isEditMode) {
            setFormData(prev => ({
              ...prev,
              start_date: projectResponse.data.project.start_date.split('T')[0],
              end_date: projectResponse.data.project.end_date.split('T')[0]
            }));
          }
          
          // If in edit mode, fetch task data
          if (isEditMode) {
            const taskResponse = await TaskService.getTaskById(taskId);
            
            if (taskResponse.success) {
              const { name, description, start_date, end_date, progress, dependencies } = taskResponse.data;
              setFormData({
                name,
                description: description || '',
                start_date: start_date.split('T')[0],
                end_date: end_date.split('T')[0],
                progress: progress || 0,
                dependencies: dependencies || ''
              });
            } else {
              setError('Failed to load task data');
            }
          }
        } else {
          setError('Failed to load project data');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, taskId, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'progress' ? parseFloat(value) : value
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
      const taskData = {
        ...formData,
        project_id: parseInt(projectId)
      };
      
      let response;
      
      if (isEditMode) {
        // Update existing task
        response = await TaskService.updateTask(taskId, taskData);
      } else {
        // Create new task
        response = await TaskService.createTask(taskData);
      }
      
      if (response.success) {
        setSuccess(isEditMode ? 'Task updated successfully' : 'Task created successfully');
        
        // Redirect back to project page after a short delay
        setTimeout(() => {
          navigate(`/projects/${projectId}`);
        }, 1500);
      } else {
        setError(response.message || 'Failed to save task');
      }
    } catch (err) {
      console.error('Error saving task:', err);
      setError('An error occurred while saving the task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="task-form-container">
      <h2 className="page-title">{formTitle}</h2>
      {project && (
        <div className="project-info">
          <p>Project: {project.name}</p>
        </div>
      )}
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Task Name *</label>
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
            min={project ? project.start_date.split('T')[0] : ''}
            max={project ? project.end_date.split('T')[0] : ''}
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
            min={formData.start_date}
            max={project ? project.end_date.split('T')[0] : ''}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="progress">Progress (%)</label>
          <input
            type="number"
            id="progress"
            name="progress"
            className="form-control"
            value={formData.progress}
            onChange={handleChange}
            min="0"
            max="100"
            step="1"
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dependencies">Dependencies (Comma-separated task IDs)</label>
          <select
            id="dependencies"
            name="dependencies"
            className="form-control"
            value={formData.dependencies}
            onChange={handleChange}
            disabled={submitting || projectTasks.length === 0}
            multiple={false}
          >
            <option value="">None</option>
            {projectTasks
              .filter(task => !isEditMode || task.id.toString() !== taskId)
              .map(task => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Task'}
          </button>
          
          <Link 
            to={`/projects/${projectId}`}
            className="btn btn-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 