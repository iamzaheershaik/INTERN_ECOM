import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_UPDATE_PROFILE,
} from '../types';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: true, // starts true to handle initial auth check
  error: null,
  isAuthenticated: !!storedToken,
  isAdmin: storedUser ? JSON.parse(storedUser)?.role === 'admin' : false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        isAuthenticated: true,
        isAdmin: action.payload.user?.role === 'admin',
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        error: null,
      };
    case AUTH_UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
        isAdmin: action.payload?.role === 'admin',
        loading: false,
        error: null,
      };
    default:
      return state;
  }
}
