import React from 'react';

const DEFAULT_STYLE = {};

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'cta', 'secondary', 'danger'
  onClick,
  disabled = false,
  loading = false,
  style = DEFAULT_STYLE,
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'cta':
        return 'btn-cta';
      case 'secondary':
        return 'btn-secondary'; // Custom defined in index.css
      default:
        return 'btn-primary';
    }
  };

  const getStyleOverride = () => {
    let baseStyle = { ...style };
    if (variant === 'danger') {
      baseStyle = {
        ...baseStyle,
        backgroundColor: 'var(--color-danger)',
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer'
      };
    }
    return baseStyle;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getVariantClass()} ${className}`}
      style={getStyleOverride()}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Processing...</span>
        </span>
      ) : children}
    </button>
  );
};

export default Button;
