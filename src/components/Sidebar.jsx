import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ projects }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Projects</h3>
        {isAdmin && (
          <Link to="/projects/new" className="btn">
            + New Project
          </Link>
        )}
      </div>
      <div className="sidebar-content">
        <ul className="project-list">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id} className="project-item">
                <Link to={`/projects/${project.id}`} className="project-link">
                  {project.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="no-projects">No projects found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 