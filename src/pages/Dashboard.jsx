import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import ProjectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { projects } = useOutletContext();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <div className="dashboard">
      <h2 className="page-title">Project Dashboard</h2>
      
      {isAdmin && (
        <div className="action-buttons">
          <Link to="/projects/new" className="btn">
            + Create New Project
          </Link>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="table-container">
          {projects && projects.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>{project.description || '-'}</td>
                    <td>{new Date(project.start_date).toLocaleDateString()}</td>
                    <td>{new Date(project.end_date).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/projects/${project.id}`} 
                          className="btn btn-secondary"
                        >
                          View
                        </Link>
                        {isAdmin && (
                          <Link 
                            to={`/projects/${project.id}/edit`} 
                            className="btn btn-secondary"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-projects">
              <p>No projects found.</p>
              {isAdmin && (
                <Link to="/projects/new" className="btn">
                  Create your first project
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 