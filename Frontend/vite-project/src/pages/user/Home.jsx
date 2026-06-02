import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartSuccessId, setCartSuccessId] = useState(null);
  const [cartError, setCartError] = useState('');

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Fitness'];

  const fetchProducts = async () => {
    setLoading(true);
    setCartError('');
    try {
      const params = {
        page,
        limit: 8,
        sort,
      };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;

      const response = await productService.getProducts(params);
      if (response?.data) {
        setProducts(response.data.products || response.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    setCartError('');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(productId, 1);
      setCartSuccessId(productId);
      setTimeout(() => setCartSuccessId(null), 2000);
    } catch (err) {
      console.error(err);
      setCartError(err.response?.data?.message || err.message || 'Error adding to cart');
      setTimeout(() => setCartError(''), 4500);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      {/* Header Banner */}
      <div className="home-banner">
        <h1 className="home-banner-title">Discover Premium Items</h1>
        <p className="home-banner-desc">
          Explore our handpicked curation of exceptional tech, clothing, and domestic goods with instant cart synchronization and ordering.
        </p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="filter-row">
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="search-form-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input-field"
          />
          <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '6px' }}>
            Find
          </button>
        </form>

        {/* Sort and Filters */}
        <div className="sort-row">
          <div className="sort-label-group">
            <SlidersHorizontal size={16} style={{ color: 'var(--color-text-muted)' }} />
            <span className="sort-label-text">Sort By:</span>
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="sort-select-dropdown"
          >
            <option value="-createdAt">Newest Arrival</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="catalog-main">
        {/* Left category filter sidebar */}
        <aside className="sidebar-filter">
          <h3 className="sidebar-title">Categories</h3>
          <div className="sidebar-list">
            {categories.map((cat) => {
              const isActive = (cat === 'All' && category === '') || category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat === 'All' ? '' : cat);
                    setPage(1);
                  }}
                  className={isActive ? 'sidebar-btn sidebar-btn-active' : 'sidebar-btn'}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Product Grid */}
        <div style={{ flex: 1 }}>
          {cartError && (
            <div className="auth-alert-danger">
              {cartError}
            </div>
          )}

          {loading ? (
            /* Loading skeletons grid */
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
          ) : products.length === 0 ? (
            /* Empty products list */
            <div className="card" style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <h3>No Products Found</h3>
              <p style={{ marginTop: '8px' }}>We couldn't find any products fitting your current query. Try resetting filters.</p>
              <button
                className="btn-primary"
                style={{ marginTop: '20px' }}
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  setSort('-createdAt');
                  setPage(1);
                }}
              >
                Reset Storefront
              </button>
            </div>
          ) : (
            /* Beautiful Product Grid */
            <>
              <div className="products-grid-container">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="card animate-fade-in"
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {/* Badge */}
                    {product.quantity <= 0 ? (
                      <span className="sold-out-badge">
                        Sold Out
                      </span>
                    ) : product.quantity < 5 ? (
                      <span className="low-stock-badge">
                        Only {product.quantity} Left
                      </span>
                    ) : null}

                    {/* Image Box */}
                    <div className="product-card-thumb flex-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-card-img"
                        />
                      ) : (
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px' }}>Image Unavailable</span>
                      )}
                    </div>

                    {/* Meta */}
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

                    {/* Pricing and Action */}
                    <div className="product-card-footer">
                      <span className="product-card-price">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        className={cartSuccessId === product._id ? 'btn-cta' : 'btn-primary'}
                        onClick={(e) => handleAddToCart(e, product._id)}
                        disabled={product.quantity <= 0}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          gap: '4px',
                        }}
                      >
                        <ShoppingCart size={14} />
                        <span>{cartSuccessId === product._id ? 'Added!' : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="pagination-btn flex-center"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="pagination-text">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="pagination-btn flex-center"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
