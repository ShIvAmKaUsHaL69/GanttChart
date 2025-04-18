import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ProjectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          const response = await ProjectService.getAllProjects();
          if (response.success) {
            setProjects(response.data);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!isLoading) {
      fetchProjects();
    }
  }, [isAuthenticated, isLoading]);

  // If auth is still loading, show a loading indicator
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app-container">
      {isAuthenticated && (
        <>
          <Sidebar projects={projects} />
          <div className="main-content">
            <Header />
            <main>
              <Outlet context={{ projects, setProjects }} />
            </main>
          </div>
        </>
      )}
      
      {!isAuthenticated && (
        <div className="full-page">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Layout; 