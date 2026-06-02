import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const CartSummary = ({
  totalPrice = 0,
  totalCount = 0,
  onCheckout,
  loading = false,
  checkoutDisabled = false
}) => {
  return (
    <aside className="card cart-summary-sidebar">
      <h3 className="summary-title-heading">Summary Order</h3>
      <div className="summary-list-rows">
        {/* Count Details */}
        <div className="summary-row-item">
          <span style={{ color: 'var(--color-text-muted)' }}>Items Count ({totalCount})</span>
          <span style={{ fontWeight: 600 }}>₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>

        {/* Shipping details */}
        <div className="summary-row-item">
          <span style={{ color: 'var(--color-text-muted)' }}>Shipping fee</span>
          <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Free</span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

        {/* Total Price */}
        <div className="summary-total-row">
          <strong>Total Amount</strong>
          <strong style={{ color: 'var(--color-primary)' }}>₹{totalPrice.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Checkout Submit trigger */}
      <button
        type="button"
        onClick={onCheckout}
        className="btn-primary summary-checkout-btn"
        disabled={checkoutDisabled || loading || totalCount === 0}
        style={{ width: '100%', gap: '8px' }}
      >
        <CreditCard size={18} />
        <span>{loading ? 'Processing Checkout...' : 'Secure Order Checkout'}</span>
      </button>

      {/* Navigation Redirect option */}
      <div className="summary-continue-link">
        <Link to="/" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
          Continue Catalog Browsing
        </Link>
      </div>
    </aside>
  );
};

export default CartSummary;
