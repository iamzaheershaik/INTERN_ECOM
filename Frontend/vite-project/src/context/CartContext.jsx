import React, { createContext, use, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../redux/actions/cartActions';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  // Select cart states directly from Redux store cart slice
  const { cart, loading, cartItemsCount, cartTotalPrice } = useSelector(
    (state) => state.cart
  );

  // Sync cart session logs whenever authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      dispatch(clearCart());
    }
  }, [isAuthenticated, dispatch]);

  // Proxy actions directly to Redux dispatch thunks
  const handleFetchCart = async () => {
    return dispatch(fetchCart());
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    return dispatch(addToCart(productId, quantity));
  };

  const handleUpdateCartItem = async (productId, quantity) => {
    return dispatch(updateCartItem(productId, quantity));
  };

  const handleRemoveFromCart = async (productId) => {
    return dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Stabilize value object with useMemo to prevent breaking children memoization
  const contextValue = useMemo(() => ({
    cart,
    loading,
    cartItemsCount,
    cartTotalPrice,
    fetchCart: handleFetchCart,
    addToCart: handleAddToCart,
    updateCartItem: handleUpdateCartItem,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
  }), [cart, loading, cartItemsCount, cartTotalPrice]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  // Replaced useContext with React 19's use() API
  const context = use(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
