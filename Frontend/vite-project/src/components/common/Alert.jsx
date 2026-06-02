import React from 'react';

const DEFAULT_STYLE = {};

const Alert = ({ type = 'error', children, style = DEFAULT_STYLE, className = '', ...props }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: '#faf5ff',
          border: '1px dashed var(--color-primary)',
          color: 'var(--color-text-main)',
        };
      case 'warning':
        return {
          background: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#b45309',
        };
      default: // 'error'
        return {
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: 'var(--color-danger)',
        };
    }
  };

  if (!children) return null;

  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '20px',
        ...getAlertStyles(),
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Alert;
