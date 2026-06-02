import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, isAdded, onClick }) => {
  return (
    <div
      className="card animate-fade-in"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* Stock Status Badge */}
      {product.quantity <= 0 ? (
        <span className="sold-out-badge">
          Sold Out
        </span>
      ) : product.quantity < 5 ? (
        <span className="low-stock-badge">
          Only {product.quantity} Left
        </span>
      ) : null}

      {/* Product Image Thumbnail */}
      <div className="product-card-thumb flex-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img"
          />
        ) : (
          <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px' }}>
            Image Unavailable
          </span>
        )}
      </div>

      {/* Product Meta details */}
      <div>
        <span className="product-card-category">
          {product.category}
        </span>
        <h3 className="product-card-title">
          {product.name}
        </h3>
        <p className="product-card-desc">
          {product.description}
        </p>
      </div>

      {/* Pricing and Action trigger */}
      <div className="product-card-footer">
        <span className="product-card-price">
          ₹{product.price?.toLocaleString('en-IN')}
        </span>
        <button
          type="button"
          className={isAdded ? 'btn-cta' : 'btn-primary'}
          onClick={(e) => onAddToCart(e, product._id)}
          disabled={product.quantity <= 0}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            gap: '4px',
          }}
        >
          <ShoppingCart size={14} />
          <span>{isAdded ? 'Added!' : 'Add'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
