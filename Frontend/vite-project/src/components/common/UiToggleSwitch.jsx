import React from 'react';
import { useUI } from '../../context/UIContext';

const UiToggleSwitch = () => {
  const { uiVersion, toggleUiVersion } = useUI();
  const isV2 = uiVersion === 'v2';

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleUiVersion();
    }
  };

  return (
    <div 
      className="flex-center" 
      style={{ 
        gap: '8px',
        background: 'var(--color-bg-alt)',
        padding: '4px 6px',
        borderRadius: '999px',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 200ms ease',
      }}
      onClick={toggleUiVersion}
      role="button"
      aria-label="Toggle UI Theme version"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <span 
        style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          padding: '4px 10px',
          borderRadius: '999px',
          color: !isV2 ? 'var(--color-primary)' : 'var(--color-text-muted)',
          background: !isV2 ? 'var(--color-bg-card)' : 'transparent',
          boxShadow: !isV2 ? 'var(--shadow-sm)' : 'none',
          transition: 'all 200ms ease',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        Classic
      </span>
      <span 
        style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          padding: '4px 10px',
          borderRadius: '999px',
          color: isV2 ? 'var(--color-success)' : 'var(--color-text-muted)',
          background: isV2 ? 'var(--color-bg-card)' : 'transparent',
          boxShadow: isV2 ? 'var(--shadow-sm)' : 'none',
          transition: 'all 200ms ease',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        Modern
      </span>
    </div>
  );
};

export default UiToggleSwitch;
