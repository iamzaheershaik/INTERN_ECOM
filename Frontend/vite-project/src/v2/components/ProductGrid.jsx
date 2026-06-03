import React from 'react';
import ProductCard from './ProductCard';

const DEFAULT_PRODUCTS = [];

const ProductGrid = ({
  products = DEFAULT_PRODUCTS,
  loading = false,
  cartSuccessId = null,
  onAddToCart,
  onProductClick,
  onResetFilters
}) => {
  if (loading) {
    /* Loading skeletons grid mockup for V2 */
    return (
      <div className="products-grid-container">
        {[1, 2, 3, 4].map((item) => (
          <div 
            key={item} 
            className="v2-glass-card" 
            style={{ 
              height: '380px', 
              padding: '16px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              opacity: 0.6 
            }}
          >
            <div style={{ background: 'var(--color-bg-alt)', height: '220px', borderRadius: '8px', width: '100%' }}></div>
            <div style={{ background: 'var(--color-bg-alt)', height: '20px', borderRadius: '4px', width: '60%', margin: '16px 0 8px 0' }}></div>
            <div style={{ background: 'var(--color-bg-alt)', height: '14px', borderRadius: '4px', width: '80%', marginBottom: '16px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '36px', alignItems: 'center' }}>
              <div style={{ background: 'var(--color-bg-alt)', height: '24px', borderRadius: '4px', width: '30%' }}></div>
              <div style={{ background: 'var(--color-bg-alt)', height: '36px', borderRadius: '6px', width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    /* Empty products placeholder for V2 */
    return (
      <div className="v2-glass-card" style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '24px', fontWeight: 400 }}>No Items Found</h3>
        <p style={{ marginTop: '8px', fontWeight: 300 }}>We couldn't find any products fitting your current query. Try resetting filters.</p>
        <button
          type="button"
          className="btn-primary"
          style={{ marginTop: '24px' }}
          onClick={onResetFilters}
        >
          Reset Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="products-grid-container">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          isAdded={cartSuccessId === product._id}
          onAddToCart={onAddToCart}
          onClick={() => onProductClick(product._id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
