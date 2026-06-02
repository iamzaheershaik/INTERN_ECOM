import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const UserLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer
        style={{
          background: 'var(--color-bg-card)',
          borderTop: '1px solid var(--color-border)',
          padding: '24px 16px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '14px',
          marginTop: '40px',
        }}
      >
        <div className="container">
          <p>© {new Date().getFullYear()} Intern Ecom. Built with extreme attention to detail and premium styling.</p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
