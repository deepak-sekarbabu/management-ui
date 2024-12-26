// src/components/ProtectedRoute.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};