import React from 'react';

const DEFAULT_STYLE = {};

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  style = DEFAULT_STYLE,
  ...props
}) => {
  return (
    <div className="form-group" style={{ width: '100%' }}>
      {label && (
        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}</span>
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-input ${className}`}
        style={{
          ...style,
          borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '12px', color: 'var(--color-danger)', fontWeight: 500, marginTop: '2px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
