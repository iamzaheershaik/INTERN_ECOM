import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  
  // Group related states to avoid many useState triggers and separate rendering cycles
  const [state, setState] = useState({
    product: null,
    loading: true,
    quantity: 1,
    error: '',
    success: false,
    buttonLoading: false,
  });

  const { product, loading, quantity, error, success, buttonLoading } = state;

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        if (response?.data) {
          setState((prev) => ({
            ...prev,
            product: response.data,
            loading: false,
          }));
        }
      } catch (err) {
        console.error(err);
        setState((prev) => ({
          ...prev,
          error: 'Failed to load product details.',
          loading: false,
        }));
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setState((prev) => ({ ...prev, error: '', success: false, buttonLoading: true }));

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, quantity);
      setState((prev) => ({ ...prev, success: true, buttonLoading: false }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || err.message || 'Error adding to cart',
        buttonLoading: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px', maxWidth: '500px', margin: '0 auto' }}>
          <h2>Product Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '16px 0 24px 0' }}>
            The item you are attempting to view does not exist or has been deleted from the catalog.
          </p>
          <button type="button" className="btn-primary" onClick={() => navigate('/')}>
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-text-muted)',
          fontWeight: 600,
          fontSize: '14px',
          marginBottom: '32px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0
        }}
      >
        <ChevronLeft size={16} />
        <span>Back to Storefront</span>
      </button>

      {/* Main detail columns */}
      <div className="details-grid">
        {/* Left image wrapper */}
        <div className="card details-img-card">
          <div className="details-img-wrap flex-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="details-img"
              />
            ) : (
              <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '18px' }}>Image Unavailable</span>
            )}
          </div>
        </div>

        {/* Right specifications and purchase column */}
        <div className="details-meta-col">
          <div>
            <span className="details-category-tag">
              {product.category}
            </span>
            <h1 className="details-product-title">{product.name}</h1>
            <h2 className="details-product-price">₹{product.price.toLocaleString('en-IN')}</h2>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div>
            <h3 className="details-desc-title">Description</h3>
            <p className="details-desc-text">{product.description}</p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Purchasing actions */}
          <div>
            {/* Errors or Success */}
            {error && (
              <div className="auth-alert-danger" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#f0fdf4', color: 'var(--color-success)', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px', fontWeight: 500 }}>
                ✓ Added {quantity} unit(s) of this item to your cart!
              </div>
            )}

            {/* Stock indicator and quantity select */}
            {product.quantity <= 0 ? (
              <div className="details-stock-out">
                Temporarily Out of Stock
              </div>
            ) : (
              <div className="details-stock-ok">
                <div className="qty-selector-wrap">
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-bg-card)', padding: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setState((prev) => ({ ...prev, quantity: Math.max(prev.quantity - 1, 1) }))}
                      disabled={quantity <= 1 || buttonLoading}
                      className="qty-picker-btn flex-center"
                    >
                      -
                    </button>
                    <span className="qty-picker-display">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setState((prev) => ({ ...prev, quantity: Math.min(prev.quantity + 1, product.quantity) }))}
                      disabled={quantity >= product.quantity || buttonLoading}
                      className="qty-picker-btn flex-center"
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    ({product.quantity} units available)
                  </span>
                </div>

                {/* Main Action buttons */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button
                    type="button"
                    className={success ? 'btn-cta' : 'btn-primary'}
                    onClick={handleAddToCart}
                    disabled={buttonLoading}
                    style={{
                      padding: '16px 32px',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: 700,
                      flex: 1,
                      maxWidth: '280px',
                    }}
                  >
                    <ShoppingCart size={18} />
                    <span>{buttonLoading ? 'Syncing...' : success ? 'Added to Cart!' : 'Add to Shopping Cart'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Premium Value Props */}
          <div className="details-props-grid">
            <div className="details-prop-card">
              <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
              <span className="details-prop-text">Secure checkout</span>
            </div>
            <div className="details-prop-card">
              <Truck size={20} style={{ color: 'var(--color-primary)' }} />
              <span className="details-prop-text">Fast Shipping</span>
            </div>
            <div className="details-prop-card">
              <RefreshCw size={20} style={{ color: 'var(--color-primary)' }} />
              <span className="details-prop-text">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
