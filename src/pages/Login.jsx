import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext, { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      console.log(`Attempting to log in with username: ${username}`);
      
      const { success, message } = await login(username, password);
      
      if (success) {
        navigate('/projects');
      } else {
        setError(message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 9V3H15" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 15V21H9" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 3L14 10" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14L3 21" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14H18V18" stroke="#7209b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 10H6V6" stroke="#7209b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="login-title">Gantt Chart Tool</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logging in
              </>
            ) : 'Log In'}
          </button>
        </form>
        
        <div className="login-hint">
          <p>Default admin: username <strong>admin</strong>, password <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 