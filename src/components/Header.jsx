import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>Gantt Chart App</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          {isAdmin && (
            <li className="nav-item">
              <Link to="/projects/new" className="nav-link">New Project</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="user-actions">
        {user ? (
          <div className="user-info">
            <span className="username">Welcome, {user.username}</span>
            <button onClick={logout} className="btn btn-secondary logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header; 