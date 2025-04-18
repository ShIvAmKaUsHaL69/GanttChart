import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProjectService from '../services/projectService';
import TaskService from '../services/taskService';
import GanttChart from '../components/GanttChart';
import { useAuth } from '../context/AuthContext';


const ProjectDetail = () => {
  const { projectId } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('Day');

  // Fetch project and tasks data
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const response = await ProjectService.getProjectById(projectId);
        
        if (response.success) {
          const projectData = response.data.project;
          setProject(projectData);
          
          // Ensure project has valid dates
          const projectStartDate = projectData.start_date;
          const projectEndDate = projectData.end_date;
          
          // Ensure all tasks have valid date formats
          const validatedTasks = response.data.tasks.map(task => {
            // Format the dates in YYYY-MM-DD format
            let startDate = task.start_date;
            let endDate = task.end_date;
            
            if (!startDate || !isValidDateString(startDate)) {
              startDate = projectStartDate;
            }
            
            if (!endDate || !isValidDateString(endDate)) {
              endDate = projectEndDate;
            }
            
            // Ensure dates are in the correct format
            startDate = formatDateToYYYYMMDD(startDate);
            endDate = formatDateToYYYYMMDD(endDate);
            
            return {
              ...task,
              start_date: startDate,
              end_date: endDate,
              progress: task.progress !== undefined ? parseFloat(task.progress) : 0
            };
          });
          
          setTasks(validatedTasks);
          console.log('Processed tasks for Gantt chart:', validatedTasks);
        } else {
          setError(response.message || 'Failed to load project');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('An error occurred while loading the project');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);
  
  // Helper function to check if a date string is valid
  const isValidDateString = (dateString) => {
    // Check if it's in YYYY-MM-DD format
    if (typeof dateString !== 'string') return false;
    return dateString.match(/^\d{4}-\d{2}-\d{2}$/);
  };
  
  // Helper function to format a date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (dateInput) => {
    if (!dateInput) return '';
    
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        // Invalid date
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Handle task updates from Gantt chart
  const handleTasksChange = async (updatedTasks) => {
    if (!isAdmin) return;
    
    try {
      // Find the changed task (assume only one task is changed at a time)
      const changedTask = updatedTasks.find(
        updated => !tasks.find(
          original => 
            original.id === updated.id && 
            original.start_date === updated.start_date && 
            original.end_date === updated.end_date && 
            original.progress === updated.progress
        )
      );
      
      if (changedTask) {
        await TaskService.updateTask(changedTask.id, changedTask);
        setTasks(updatedTasks);
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Handle project deletion
  const handleDeleteProject = async () => {
    // Simple confirmation
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await ProjectService.deleteProject(projectId);
      
      if (response.success) {
        navigate('/', { replace: true });
      } else {
        setError(response.message || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('An error occurred while deleting the project');
    }
  };

  if (loading) {
    return <div className="loading">Loading project data...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn">Return to Dashboard</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="not-found">
        <h2>Project Not Found</h2>
        <p>The project you are looking for does not exist or has been deleted.</p>
        <Link to="/" className="btn">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="project-header">
        <h2 className="page-title">{project.name}</h2>
        
        <div className="project-actions">
          {isAdmin && (
            <>
              <Link 
                to={`/projects/${projectId}/edit`} 
                className="btn btn-secondary"
              >
                Edit Project
              </Link>
              <Link 
                to={`/projects/${projectId}/tasks/new`} 
                className="btn btn-secondary"
              >
                Add Task
              </Link>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteProject}
              >
                Delete Project
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="project-info">
        <div className="info-item">
          <span className="label">Start Date:</span>
          <span className="value">{new Date(project.start_date).toLocaleDateString()}</span>
        </div>
        <div className="info-item">
          <span className="label">End Date:</span>
          <span className="value">{new Date(project.end_date).toLocaleDateString()}</span>
        </div>
        {project.description && (
          <div className="info-item description">
            <span className="label">Description:</span>
            <span className="value">{project.description}</span>
          </div>
        )}
      </div>
      
      <div className="gantt-section">
        <div className="gantt-header">
          <h3>Project Timeline</h3>
          
          <div className="view-mode-selector">
            <label htmlFor="viewMode">View Mode:</label>
            <select 
              id="viewMode" 
              value={viewMode} 
              onChange={(e) => {
                // Update view mode state
                setViewMode(e.target.value);
                
                // Show a loading message (optional, can be removed if causing issues)
                const ganttSection = document.querySelector('.gantt-section');
                if (ganttSection) {
                  let messageDiv = document.querySelector('.view-mode-message');
                  if (!messageDiv) {
                    messageDiv = document.createElement('div');
                    messageDiv.className = 'view-mode-message';
                    ganttSection.insertBefore(messageDiv, ganttSection.firstChild.nextSibling); // Insert after header
                  }
                  messageDiv.innerHTML = `Changing to ${e.target.value} view...`;
                  
                  // Remove after 3 seconds
                  setTimeout(() => { messageDiv?.remove(); }, 3000);
                }
              }}
              className="form-control"
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
        </div>
        
        {tasks.length > 0 ? (
          <>
            <div className="gantt-container-wrapper"> {/* Optional wrapper if needed */} 
              <GanttChart 
                tasks={tasks} 
                onTasksChange={handleTasksChange} 
                viewMode={viewMode}
                readOnly={!isAdmin}
              />
            </div>

            <div className="gantt-controls">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const container = document.querySelector('.gantt-container');
                  container?.scrollTo({ left: 0, behavior: 'smooth' });
                }}
              >
                Scroll to Start
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const container = document.querySelector('.gantt-container');
                  container?.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
                }}
              >
                Scroll to End
              </button>
            </div>

            <div className="gantt-instructions">
              <p>
                <strong>Note:</strong> Use the scroll controls or scroll within the chart area to navigate the timeline.
                If the chart doesn't render correctly after changing view modes, try switching back to Day view.
              </p>
            </div>
          </>
        ) : (
          <div className="no-tasks">
            <p>No tasks found for this project.</p>
            {isAdmin && (
              <Link to={`/projects/${projectId}/tasks/new`} className="btn">
                Add your first task
              </Link>
            )}
          </div>
        )}
      </div>
      
      {tasks.length > 0 && (
        <div className="tasks-section">
          <h3>Tasks</h3>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Progress</th>
                  <th>Dependencies</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{new Date(task.start_date).toLocaleDateString()}</td>
                    <td>{new Date(task.end_date).toLocaleDateString()}</td>
                    <td>{task.progress}%</td>
                    <td>{task.dependencies || '-'}</td>
                    {isAdmin && (
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/projects/${projectId}/tasks/${task.id}/edit`} 
                            className="btn btn-secondary"
                          >
                            Edit
                          </Link>
                          <button 
                            className="btn btn-danger"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this task?')) {
                                await TaskService.deleteTask(task.id);
                                setTasks(tasks.filter(t => t.id !== task.id));
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail; 