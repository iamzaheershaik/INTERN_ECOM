import React from 'react';
import { Trash2 } from 'lucide-react';

const CartItem = ({
  item,
  onQtyChange,
  onRemove,
  onProductClick,
  loading = false
}) => {
  const product = item.productId || {};

  return (
    <div className="card cart-item-row-card">
      {/* Product Image Thumbnail */}
      <div className="cart-item-img-wrap flex-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="cart-item-img" />
        ) : (
          <span style={{ fontSize: '10px', fontWeight: 600 }}>No Image</span>
        )}
      </div>

      {/* Product Information details */}
      <div className="cart-item-info">
        <span className="cart-item-category">
          {product.category}
        </span>
        <h3
          onClick={onProductClick}
          className="cart-item-title"
        >
          {product.name}
        </h3>
        <span className="cart-item-price">₹{product.price?.toLocaleString('en-IN')}</span>
      </div>

      {/* Quantity Adjusters */}
      <div className="cart-item-qty-wrap">
        <button
          type="button"
          onClick={() => onQtyChange(product._id, item.quantity, false)}
          disabled={loading || item.quantity <= 1}
          className="cart-item-qty-btn flex-center"
        >
          -
        </button>
        <span className="cart-item-qty-display">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onQtyChange(product._id, item.quantity, true)}
          disabled={loading || item.quantity >= product.quantity}
          className="cart-item-qty-btn flex-center"
        >
          +
        </button>
      </div>

      {/* Pricing Subtotals */}
      <div className="cart-item-subtotal-wrap">
        <span className="cart-item-subtotal-label">Subtotal</span>
        <strong className="cart-item-subtotal-price">
          ₹{((item.quantity || 0) * (product.price || 0)).toLocaleString('en-IN')}
        </strong>
      </div>

      {/* Trash Removal Action */}
      <button
        type="button"
        onClick={() => onRemove(product._id)}
        disabled={loading}
        className="cart-item-remove-btn flex-center"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
