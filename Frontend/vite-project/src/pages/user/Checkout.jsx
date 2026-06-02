import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import { CheckCircle, ArrowLeft, CreditCard } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotalPrice, cartItemsCount, clearCart } = useCart();
  const navigate = useNavigate();

  // Group all states into a single hook to optimize performance and render cycles
  const [checkoutState, setCheckoutState] = useState({
    street: '',
    city: '',
    addressState: '', // Renamed from 'state' to avoid collision with standard React state naming
    zip: '',
    phone: '',
    loading: false,
    successOrder: null,
    error: '',
  });

  const { street, city, addressState, zip, phone, loading, successOrder, error } = checkoutState;

  const items = cart?.items || [];

  // Protect route - Redirect if empty cart (unless success screen is active)
  useEffect(() => {
    if (!loading && !successOrder && items.length === 0) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [items, successOrder, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckoutState((prev) => ({ ...prev, error: '' }));
    
    if (!street || !city || !addressState || !zip || !phone) {
      setCheckoutState((prev) => ({ ...prev, error: 'Please fill in all the required shipping and contact details.' }));
      return;
    }

    setCheckoutState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await orderService.createOrder();
      if (response?.data) {
        setCheckoutState((prev) => ({
          ...prev,
          successOrder: response.data,
          loading: false,
        }));
        clearCart();
      }
    } catch (err) {
      console.error('Order creation checkout error:', err);
      setCheckoutState((prev) => ({
        ...prev,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Checkout transaction failed. An item might be out of stock.',
        loading: false,
      }));
    }
  };

  // 1. Success Placed Screen Flow
  if (successOrder) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px', maxWidth: '550px', margin: '0 auto', borderRadius: '16px', boxShadow: 'var(--shadow-xl)' }}>
          <div className="flex-center" style={{ width: '72px', height: '72px', background: '#dcfce7', color: 'var(--color-success)', borderRadius: '50%', fontSize: '36px', margin: '0 auto 24px auto' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--color-text-main)', marginBottom: '12px' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            Thank you for your purchase. Your order reference is <strong style={{ color: 'var(--color-primary)' }}>#{successOrder._id || successOrder.id}</strong>.
            We have received your shipping details for <strong style={{ color: 'var(--color-text-main)' }}>{city}, {addressState}</strong> and are preparing your packages.
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

  // 2. Empty Cart Safeguard Fallback Screen
  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px', maxWidth: '500px', margin: '0 auto', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Your Shopping Basket is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '15px' }}>
            There are no products to checkout. Redirecting you back to the storefront catalog...
          </p>
          <Link to="/" className="btn-primary">
            Browse Storefront
          </Link>
        </div>
      </div>
    );
  }

  // 3. Main Form Screen
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      {/* Back Link */}
      <div style={{ marginBottom: '24px' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>
          <ArrowLeft size={16} />
          <span>Return to Shopping Basket</span>
        </Link>
      </div>

      <h1 style={{ fontSize: '32px', marginBottom: '32px' }}>Secure Checkout</h1>

      {error && (
        <Alert type="error" style={{ marginBottom: '24px' }}>
          {error}
        </Alert>
      )}

      <div className="cart-layout-grid" style={{ alignItems: 'flex-start' }}>
        {/* Left Side: Form */}
        <div className="card" style={{ padding: '32px', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--color-text-main)', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Shipping Address & Contact
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Street Address"
              value={street}
              onChange={(e) => setCheckoutState((prev) => ({ ...prev, street: e.target.value }))}
              placeholder="123 Main St, Apartment 4B"
              required
            />

            <div className="form-row">
              <Input
                label="City"
                value={city}
                onChange={(e) => setCheckoutState((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="New Delhi"
                required
              />
              <Input
                label="State"
                value={addressState}
                onChange={(e) => setCheckoutState((prev) => ({ ...prev, addressState: e.target.value }))}
                placeholder="Delhi"
                required
              />
            </div>

            <div className="form-row">
              <Input
                label="Pin Code / ZIP"
                value={zip}
                onChange={(e) => setCheckoutState((prev) => ({ ...prev, zip: e.target.value }))}
                placeholder="110001"
                required
              />
              <Input
                label="Contact Phone"
                type="tel"
                value={phone}
                onChange={(e) => setCheckoutState((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <span className="form-label" style={{ fontWeight: 600, fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Payment Method
              </span>
              <div style={{ padding: '16px', background: 'var(--color-bg-main)', border: '1px solid var(--color-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="radio" checked readOnly style={{ accentColor: 'var(--color-primary)' }} />
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>Cash on Delivery (COD)</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Pay with cash upon package receipt.
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="cta"
              loading={loading}
              style={{ padding: '14px', width: '100%', marginTop: '12px', fontWeight: 700, display: 'flex', gap: '8px', justifyContent: 'center' }}
            >
              <CreditCard size={18} />
              <span>Confirm & Place Order</span>
            </Button>
          </form>
        </div>

        {/* Right Side: Order Review Summary */}
        <aside className="card cart-summary-sidebar" style={{ padding: '24px' }}>
          <h3 className="summary-title-heading" style={{ fontSize: '18px', marginBottom: '16px' }}>Order Review</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            {items.map((item, idx) => {
              const product = item.productId || {};
              return (
                <div key={idx} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div style={{ maxWidth: '70%' }}>
                    <strong style={{ color: 'var(--color-text-main)' }}>{product.name}</strong>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '2px' }}>
                      Qty: {item.quantity} × ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <strong style={{ color: 'var(--color-text-main)', alignSelf: 'center' }}>
                    ₹{(item.quantity * product.price).toLocaleString('en-IN')}
                  </strong>
                </div>
              );
            })}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: '16px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Items Subtotal ({cartItemsCount})</span>
              <strong style={{ color: 'var(--color-text-main)' }}>₹{cartTotalPrice.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Shipping Fee</span>
              <strong style={{ color: 'var(--color-success)' }}>Free</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
              <strong>Total Amount</strong>
              <strong style={{ color: 'var(--color-primary)' }}>₹{cartTotalPrice.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
