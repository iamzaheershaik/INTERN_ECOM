import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-dim-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="card animate-fade-in" 
        style={{ 
          maxWidth: '500px', 
          width: '90%', 
          padding: '32px', 
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '22px', margin: 0, color: 'var(--color-text-main)' }}>{title}</h2>
          <button 
            type="button"
            onClick={onClose} 
            style={{ 
              color: 'var(--color-text-muted)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
