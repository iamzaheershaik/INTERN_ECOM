import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, Users, LogOut, Store } from 'lucide-react';

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, loading, logout, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Authenticating Admin Session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const menuItems = [
    { path: '/admin/dashboard', name: 'Overview Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', name: 'Product Catalog', icon: ShoppingBag },
    { path: '/admin/users', name: 'User Management', icon: Users },
  ];

  return (
    <div className="admin-sidebar-layout">
      {/* Sidebar Panel */}
      <aside className="admin-sidebar">
        {/* Brand/Header */}
        <div className="admin-sidebar-logo-header">
          <div className="admin-sidebar-logo-icon">
            IE
          </div>
          <div>
            <h3 className="admin-sidebar-logo-title">Intern Ecom</h3>
            <span className="admin-sidebar-logo-subtitle">Admin Console</span>
          </div>
        </div>

        {/* User Card */}
        <div className="admin-sidebar-user-info">
          <div className="admin-sidebar-user-avatar">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 className="admin-sidebar-user-name">{user?.firstName} {user?.lastName}</h4>
            <span className="admin-sidebar-user-email">{user?.email}</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="admin-sidebar-menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={isActive ? 'admin-sidebar-menu-link admin-sidebar-menu-link-active' : 'admin-sidebar-menu-link'}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-sidebar-footer-link">
            <Store size={20} />
            <span>Go to Shop View</span>
          </Link>
          <button onClick={logout} className="admin-sidebar-footer-btn">
            <LogOut size={20} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Display Content */}
      <div className="admin-main-view">
        <header className="admin-main-header">
          <div className="admin-main-header-status">
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Status: <strong style={{ color: 'var(--color-success)' }}>Connected</strong></span>
            <div className="admin-status-dot"></div>
          </div>
        </header>

        <main className="admin-main-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
