import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children, onRequireAuth }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      onRequireAuth();
    }
  }, [user, onRequireAuth]);

  if (!user) {
    return null;
  }

  return children;
}

export default PrivateRoute;
