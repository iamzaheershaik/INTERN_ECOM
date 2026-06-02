import cartService from '../../services/cartService';
import {
  CART_START,
  CART_SUCCESS,
  CART_FAILURE,
  CART_CLEAR,
} from '../types';

// Synchronous actions
export const cartStart = () => ({ type: CART_START });
export const cartSuccess = (cartData) => ({
  type: CART_SUCCESS,
  payload: cartData,
});
export const cartFailure = (error) => ({
  type: CART_FAILURE,
  payload: error,
});
export const cartClear = () => ({ type: CART_CLEAR });

// Asynchronous thunks
export const fetchCart = () => async (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return;

  dispatch(cartStart());
  try {
    const response = await cartService.getCart();
    if (response?.data) {
      dispatch(cartSuccess(response.data));
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    dispatch(cartFailure(error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Error fetching cart'));
  }
};

export const addToCart = (productId, quantity = 1) => async (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    throw new Error('Please log in to add products to your cart.');
  }

  dispatch(cartStart());
  try {
    const response = await cartService.addToCart(productId, quantity);
    if (response?.data) {
      dispatch(cartSuccess(response.data));
      return response.data;
    }
    throw new Error('Could not add item to cart');
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Could not add item to cart';
    dispatch(cartFailure(errMsg));
    throw error;
  }
};

export const updateCartItem = (productId, quantity) => async (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return;

  dispatch(cartStart());
  try {
    const response = await cartService.updateCartItem(productId, quantity);
    if (response?.data) {
      dispatch(cartSuccess(response.data));
      return response.data;
    }
    throw new Error('Could not update cart quantity');
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Could not update cart quantity';
    dispatch(cartFailure(errMsg));
    throw error;
  }
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) return;

  dispatch(cartStart());
  try {
    const response = await cartService.removeFromCart(productId);
    if (response?.data) {
      dispatch(cartSuccess(response.data));
      return response.data;
    }
    throw new Error('Could not remove item from cart');
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'Could not remove item from cart';
    dispatch(cartFailure(errMsg));
    throw error;
  }
};

export const clearCart = () => (dispatch) => {
  dispatch(cartClear());
};
