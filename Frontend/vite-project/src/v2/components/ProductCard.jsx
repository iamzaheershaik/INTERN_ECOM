import React from 'react';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, isAdded, onClick }) => {
  return (
    <div
      className="v2-glass-card v2-product-card animate-fade-in"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: '16px',
        position: 'relative',
      }}
    >
      {/* Stock Status Badge */}
      {product.quantity <= 0 ? (
        <span className="v2-product-badge" style={{ backgroundColor: 'var(--color-danger)' }}>
          Sold Out
        </span>
      ) : product.quantity < 5 ? (
        <span className="v2-product-badge" style={{ backgroundColor: '#d97706' }}>
          {product.quantity} Left
        </span>
      ) : null}

      {/* Product Image Thumbnail */}
      <div className="v2-product-img-wrap flex-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="v2-product-img"
          />
        ) : (
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '14px', fontFamily: 'var(--font-headings)' }}>
            Unavailable
          </span>
        )}
      </div>

      {/* Product Meta details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span className="v2-product-category">
          {product.category}
        </span>
        <h3 className="v2-product-title">
          {product.name}
        </h3>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '13px',
          margin: '0 0 16px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '38px',
          lineHeight: '19px',
          fontWeight: 300
        }}>
          {product.description}
        </p>
      </div>

      {/* Pricing and Action trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span className="v2-product-price">
          ₹{product.price?.toLocaleString('en-IN')}
        </span>
        <button
          type="button"
          className={isAdded ? 'btn-cta' : 'btn-primary'}
          onClick={(e) => onAddToCart(e, product._id)}
          disabled={product.quantity <= 0}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShoppingCart size={13} />
          <span>{isAdded ? 'Added' : 'Add'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
