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
    /* Loading skeletons grid mockup */
    return (
      <div className="products-grid-container">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.6 }}>
            <div style={{ background: 'var(--color-bg-alt)', height: '180px', borderRadius: '8px', width: '100%' }}></div>
            <div style={{ background: 'var(--color-bg-alt)', height: '24px', borderRadius: '4px', width: '80%', margin: '12px 0 6px 0' }}></div>
            <div style={{ background: 'var(--color-bg-alt)', height: '18px', borderRadius: '4px', width: '50%', marginBottom: '16px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '36px' }}>
              <div style={{ background: 'var(--color-bg-alt)', height: '24px', borderRadius: '4px', width: '30%', alignSelf: 'center' }}></div>
              <div style={{ background: 'var(--color-bg-alt)', height: '36px', borderRadius: '6px', width: '40%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    /* Empty products placeholder */
    return (
      <div className="card" style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <h3>No Products Found</h3>
        <p style={{ marginTop: '8px' }}>We couldn't find any products fitting your current query. Try resetting filters.</p>
        <button
          type="button"
          className="btn-primary"
          style={{ marginTop: '20px' }}
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
