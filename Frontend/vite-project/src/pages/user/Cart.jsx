import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../cart/CartItem';
import CartSummary from '../../cart/CartSummary';
import Alert from '../../components/common/Alert';
import { ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, cartTotalPrice, cartItemsCount, updateCartItem, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleQtyChange = async (productId, currentQty, increment) => {
    setError('');
    const newQty = increment ? currentQty + 1 : currentQty - 1;
    try {
      await updateCartItem(productId, newQty);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error updating item quantity');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleRemove = async (productId) => {
    setError('');
    try {
      await removeFromCart(productId);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error removing item from cart');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const items = cart?.items || [];

  return (
    <div className="container page-section">
      <h1 className="page-title">Shopping Basket</h1>

      <Alert type="error" style={{ marginBottom: '24px' }}>
        {error}
      </Alert>

      {items.length === 0 ? (
        <div className="card empty-state-card">
          <div className="flex-center" style={{ width: '64px', height: '64px', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 20px auto' }}>
            <ShoppingBag size={28} />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '15px' }}>
            It looks like you haven't added any products to your basket yet.
          </p>
          <Link to="/" className="btn-primary">
            Browse Storefront Catalog
          </Link>
        </div>
      ) : (
        <div className="cart-layout-grid">
          {/* Left item rows table */}
          <div className="cart-items-column">
            {items.map((item) => (
              <CartItem
                key={item.productId?._id}
                item={item}
                onQtyChange={handleQtyChange}
                onRemove={handleRemove}
                onProductClick={() => navigate(`/product/${item.productId?._id}`)}
                loading={loading}
              />
            ))}
          </div>

          {/* Right Summary column */}
          <CartSummary
            totalPrice={cartTotalPrice}
            totalCount={cartItemsCount}
            onCheckout={handleCheckout}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default Cart;
