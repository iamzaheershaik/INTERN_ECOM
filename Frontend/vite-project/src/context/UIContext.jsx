import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [uiVersion, setUiVersion] = useState(() => {
    try {
      const saved = localStorage.getItem('uiVersion');
      return saved === 'v2' ? 'v2' : 'v1';
    } catch {
      return 'v1';
    }
  });

  const toggleUiVersion = () => {
    setUiVersion((prev) => {
      const next = prev === 'v1' ? 'v2' : 'v1';
      try {
        localStorage.setItem('uiVersion', next);
      } catch (err) {
        console.error('Failed to save UI version:', err);
      }
      return next;
    });
  };

  return (
    <UIContext.Provider value={{ uiVersion, setUiVersion, toggleUiVersion }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
