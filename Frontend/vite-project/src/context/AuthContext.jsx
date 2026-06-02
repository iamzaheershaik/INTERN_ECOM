import React, { createContext, use, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeAuth,
  login,
  register,
  logout,
  updateProfile,
  verifyOTP,
} from '../redux/actions/authActions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  
  // Select slice of state from Redux auth branch
  const { user, token, loading, isAuthenticated, isAdmin } = useSelector(
    (state) => state.auth
  );

  // Initialize session checks on application start
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Map contextual actions directly to Redux dispatch actions
  const handleLogin = async (email, password) => {
    return dispatch(login(email, password));
  };

  const handleRegister = async (userData) => {
    return dispatch(register(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = async (updatedData) => {
    return dispatch(updateProfile(updatedData));
  };

  const handleVerifyOTP = async (email, otp) => {
    return dispatch(verifyOTP(email, otp));
  };

  // Stabilize value object with useMemo to prevent breaking children memoization
  const contextValue = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    verifyOTP: handleVerifyOTP,
  }), [user, token, loading, isAuthenticated, isAdmin]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // Replaced useContext with React 19's use() API
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
