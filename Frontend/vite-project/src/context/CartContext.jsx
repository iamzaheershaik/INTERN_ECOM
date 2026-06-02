import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await cartService.getCart();
      if (response?.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to add products to your cart.');
    }
    const response = await cartService.addToCart(productId, quantity);
    if (response?.data) {
      setCart(response.data);
      return response.data;
    }
    throw new Error('Could not add item to cart');
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) return;
    const response = await cartService.updateCartItem(productId, quantity);
    if (response?.data) {
      setCart(response.data);
      return response.data;
    }
    throw new Error('Could not update cart quantity');
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    const response = await cartService.removeFromCart(productId);
    if (response?.data) {
      setCart(response.data);
      return response.data;
    }
    throw new Error('Could not remove item from cart');
  };

  const clearCart = () => {
    setCart(null);
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotalPrice = cart?.items?.reduce((total, item) => total + item.quantity * item.price, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemsCount,
        cartTotalPrice,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
