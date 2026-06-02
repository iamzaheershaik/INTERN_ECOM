import React from 'react';

const Loader = ({ fullPage = false, message = 'Loading...' }) => {
  const spinner = (
    <div className="flex-center" style={{ flexDirection: 'column', gap: '16px' }}>
      <div 
        style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid var(--color-border)', 
          borderTop: '4px solid var(--color-primary)', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} 
      />
      {message && <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '15px' }}>{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', width: '100%', flexDirection: 'column', background: 'var(--color-bg-main)' }}>
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex-center" style={{ padding: '48px 0', width: '100%' }}>
      {spinner}
    </div>
  );
};

export default Loader;
