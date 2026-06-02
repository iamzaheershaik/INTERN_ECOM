import authService from '../../services/authService';
import adminService from '../../services/adminService';
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_UPDATE_PROFILE,
} from '../types';

// Synchronous actions
export const authStart = () => ({ type: AUTH_START });
export const authSuccess = (user, token) => ({
  type: AUTH_SUCCESS,
  payload: { user, token },
});
export const authFailure = (error) => ({
  type: AUTH_FAILURE,
  payload: error,
});
export const authLogout = () => ({ type: AUTH_LOGOUT });
export const authUpdateProfile = (user) => ({
  type: AUTH_UPDATE_PROFILE,
  payload: user,
});

// Asynchronous thunks
export const initializeAuth = () => async (dispatch) => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedToken && storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      dispatch(authSuccess(parsedUser, storedToken));

      // Validate session with backend
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
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch(authSuccess(updatedUser, storedToken));
      }
    } catch (error) {
      console.error('Session validation failed, logging out...', error);
      dispatch(logout());
    }
  } else {
    // If no storage details exist, mark initialization as complete
    dispatch(authFailure(null));
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await authService.login({ email, password });
    if (response?.data) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(authSuccess(user, token));
      return user;
    }
    throw new Error('Invalid login response');
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Login failed';
    dispatch(authFailure(errMsg));
    throw error;
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await authService.register(userData);
    // Registration no longer issues a JWT — user must verify email first
    dispatch(authFailure(null));
    return response;
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Registration failed';
    dispatch(authFailure(errMsg));
    throw error;
  }
};

export const verifyOTP = (email, otp) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await authService.verifyOTP({ email, otp });
    if (response?.data) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch(authSuccess(user, token));
      return user;
    }
    throw new Error('Invalid verification response');
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'OTP verification failed';
    dispatch(authFailure(errMsg));
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(authLogout());
};

export const updateProfile = (updatedData) => async (dispatch, getState) => {
  const { auth } = getState();
  const userId = auth.user?.id || auth.user?._id;
  if (!userId) throw new Error('No user is currently logged in');

  dispatch(authStart());
  try {
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
      dispatch(authUpdateProfile(freshUser));
      return freshUser;
    }
    throw new Error('Profile update failed');
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Profile update failed';
    dispatch(authFailure(errMsg));
    throw error;
  }
};
