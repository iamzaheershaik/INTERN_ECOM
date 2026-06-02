import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading Account Details...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />;
  }

  return (
    <div className="flex-center auth-layout">
      <div className="flex-center" style={{ width: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
