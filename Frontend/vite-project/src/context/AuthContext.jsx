import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import adminService from '../services/adminService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);

          // Verify token validity with backend
          const response = await adminService.updateUser(parsedUser.id || parsedUser._id, {});
          if (response?.data) {
            const updatedUser = {
              id: response.data._id || response.data.id,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
              role: response.data.role,
              phone: response.data.phone,
              isActive: response.data.isActive,
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error('Session validation failed, logging out...', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    if (response?.data) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return user;
    }
    throw new Error('Invalid login response');
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response?.data) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      return user;
    }
    throw new Error('Invalid registration response');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    const userId = user?.id || user?._id;
    if (!userId) throw new Error('No user is currently logged in');
    
    const response = await adminService.updateUser(userId, updatedData);
    if (response?.data) {
      const freshUser = {
        id: response.data._id || response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role,
        phone: response.data.phone,
        isActive: response.data.isActive,
      };
      localStorage.setItem('user', JSON.stringify(freshUser));
      setUser(freshUser);
      return freshUser;
    }
    throw new Error('Profile update failed');
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
