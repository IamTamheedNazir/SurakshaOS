import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication and user is not logged in
  if (requireAuth && !user) {
    // Redirect to login page but save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If route requires NO authentication (like login/register) and user IS logged in
  if (!requireAuth && user) {
    // Redirect to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated or route doesn't require auth
  return children;
};

export default ProtectedRoute;
