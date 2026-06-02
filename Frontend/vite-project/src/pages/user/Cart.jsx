import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import { Trash2, ShoppingBag, CreditCard, CheckCircle } from 'lucide-react';

const Cart = () => {
  const { cart, cartTotalPrice, cartItemsCount, updateCartItem, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
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

  const handleCheckout = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await orderService.createOrder();
      if (response?.data) {
        setSuccessOrder(response.data);
        clearCart();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Checkout failed. An item might be out of stock.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px', maxWidth: '550px', margin: '0 auto', borderRadius: '16px', boxShadow: 'var(--shadow-xl)' }}>
          <div className="flex-center" style={{ width: '72px', height: '72px', background: '#dcfce7', color: 'var(--color-success)', borderRadius: '50%', fontSize: '36px', margin: '0 auto 24px auto' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--color-text-main)', marginBottom: '12px' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            Thank you for your purchase. Your order ID is <strong style={{ color: 'var(--color-primary)' }}>#{successOrder._id || successOrder.id}</strong>.
            The items have been checked out and are being prepared for shipping.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/order-history" className="btn-primary" style={{ padding: '12px 24px' }}>
              View Purchase History
            </Link>
            <Link to="/" style={{ padding: '12px 24px', border: '1px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text-main)', fontWeight: 600 }}>
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '32px' }}>Shopping Basket</h1>

      {error && (
        <div className="auth-alert-danger" style={{ marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="card" style={{ padding: '64px', textAlign: 'center', borderRadius: '16px' }}>
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
            {items.map((item) => {
              const product = item.productId || {};
              return (
                <div key={product._id} className="card cart-item-row-card">
                  {/* Thumbnail */}
                  <div className="cart-item-img-wrap flex-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="cart-item-img" />
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>No Image</span>
                    )}
                  </div>

                  {/* Title & category */}
                  <div className="cart-item-info">
                    <span className="cart-item-category">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="cart-item-title"
                    >
                      {product.name}
                    </h3>
                    <span className="cart-item-price">${product.price?.toFixed(2)}</span>
                  </div>

                  {/* Qty triggers */}
                  <div className="cart-item-qty-wrap">
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity, false)}
                      disabled={loading}
                      className="cart-item-qty-btn flex-center"
                    >
                      -
                    </button>
                    <span className="cart-item-qty-display">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(product._id, item.quantity, true)}
                      disabled={loading || item.quantity >= product.quantity}
                      className="cart-item-qty-btn flex-center"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="cart-item-subtotal-wrap">
                    <span className="cart-item-subtotal-label">Subtotal</span>
                    <strong className="cart-item-subtotal-price">
                      ${(item.quantity * product.price).toFixed(2)}
                    </strong>
                  </div>

                  {/* Trash */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    disabled={loading}
                    className="cart-item-remove-btn flex-center"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Summary column */}
          <aside className="card cart-summary-sidebar">
            <h3 className="summary-title-heading">Summary Order</h3>
            <div className="summary-list-rows">
              <div className="summary-row-item">
                <span style={{ color: 'var(--color-text-muted)' }}>Items Count ({cartItemsCount})</span>
                <span style={{ fontWeight: 600 }}>${cartTotalPrice.toFixed(2)}</span>
              </div>
              <div className="summary-row-item">
                <span style={{ color: 'var(--color-text-muted)' }}>Shipping fee</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Free</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
              <div className="summary-total-row">
                <strong>Total Amount</strong>
                <strong style={{ color: 'var(--color-primary)' }}>${cartTotalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary summary-checkout-btn"
              disabled={loading || items.length === 0}
            >
              <CreditCard size={18} />
              <span>{loading ? 'Processing Checkout...' : 'Secure Order Checkout'}</span>
            </button>

            <div className="summary-continue-link">
              <Link to="/" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                Continue Catalog Browsing
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
