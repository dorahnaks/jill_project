import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ currentUserRole, allowedRoles, children }) => {
  if (!allowedRoles.includes(currentUserRole)) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default ProtectedRoute;
