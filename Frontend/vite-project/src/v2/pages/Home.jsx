import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductGrid from '../components/ProductGrid';
import useDebounce from '../../hooks/useDebounce';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

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
  const [categories, setCategories] = useState(['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Fitness']);

  const debouncedSearch = useDebounce(search, 400);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response?.data && response.data.length > 0) {
        const dbCategories = response.data.filter(Boolean).map((cat) => cat.trim());
        const unique = ['All', ...new Set(dbCategories)];
        setCategories(unique);
      }
    } catch (err) {
      console.error('Error loading dynamic categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setCartError('');
    try {
      const params = {
        page,
        limit: 8,
        sort,
      };
      if (debouncedSearch) params.search = debouncedSearch;
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
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page, debouncedSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
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
    <div className="container page-section">
      {/* V2 Premium Hero Banner */}
      <div className="v2-home-banner">
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-success)', display: 'block', marginBottom: '12px' }}>
          Curated Elegance
        </span>
        <h1 className="v2-home-banner-title">Discover Premium Items</h1>
        <p className="v2-home-banner-desc">
          Explore our handpicked collection of exceptional tech, clothing, and lifestyle products, featuring instant synchronization and checkout.
        </p>
      </div>

      {/* V2 Filter & Search Bar Row */}
      <div className="v2-filter-row">
        <form onSubmit={handleSearchSubmit} className="v2-search-wrap">
          <Search size={18} style={{ color: 'var(--color-text-muted)', marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="v2-search-input"
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={15} style={{ color: 'var(--color-text-muted)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Sort By:</span>
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="v2-sort-dropdown"
          >
            <option value="-createdAt">Newest Arrivals</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* V2 Main Grid & Sidebar Layout */}
      <div className="catalog-main">
        {/* Left Category Sidebar */}
        <aside className="sidebar-filter v2-glass-card" style={{ border: 'none' }}>
          <h3 className="v2-sidebar-title">Categories</h3>
          <div className="sidebar-list">
            {categories.map((cat) => {
              const isActive = (cat === 'All' && category === '') || category === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setCategory(cat === 'All' ? '' : cat);
                    setPage(1);
                  }}
                  className={isActive ? 'v2-sidebar-btn v2-sidebar-btn-active' : 'v2-sidebar-btn'}
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
            <div className="auth-alert-danger" style={{ borderRadius: '6px' }}>
              {cartError}
            </div>
          )}

          <ProductGrid
            products={products}
            loading={loading}
            cartSuccessId={cartSuccessId}
            onAddToCart={handleAddToCart}
            onProductClick={(id) => navigate(`/product/${id}`)}
            onResetFilters={() => {
              setSearch('');
              setCategory('');
              setSort('-createdAt');
              setPage(1);
            }}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container" style={{ gap: '12px' }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="pagination-btn flex-center v2-glass-card"
                style={{ width: '36px', height: '36px', borderRadius: '4px', border: 'none' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="pagination-text" style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="pagination-btn flex-center v2-glass-card"
                style={{ width: '36px', height: '36px', borderRadius: '4px', border: 'none' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
