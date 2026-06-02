import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import FilterBar from '../../product/FilterBar';
import ProductGrid from '../../product/ProductGrid';
import useDebounce from '../../hooks/useDebounce';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const debouncedSearch = useDebounce(search, 400);

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
    <div className="container" style={{ padding: '40px 0' }}>
      {/* Header Banner */}
      <div className="home-banner">
        <h1 className="home-banner-title">Discover Premium Items</h1>
        <p className="home-banner-desc">
          Explore our handpicked curation of exceptional tech, clothing, and domestic goods with instant cart synchronization and ordering.
        </p>
      </div>

      {/* Filter and Search Bar Row */}
      <FilterBar
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        onSearchSubmit={handleSearchSubmit}
        sort={sort}
        onSortChange={(e) => {
          setSort(e.target.value);
          setPage(1);
        }}
      />

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
                  type="button"
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
            <div className="pagination-container">
              <button
                type="button"
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
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="pagination-btn flex-center"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
