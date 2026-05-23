import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  // Specific check for the admin email requested by the user
  const isAdmin = user?.email?.toLowerCase() === 'admin@leanssmartshopbd.com';

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
