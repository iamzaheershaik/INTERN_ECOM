import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, History, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="global-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo-link" onClick={closeMenu}>
          <div className="navbar-logo-icon">IE</div>
          <h2 className="navbar-logo-text">Intern Ecom</h2>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="navbar-hamburger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Dynamic Navigation Links */}
        <nav className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-open' : ''}`}>
          {isAdmin ? (
            /* Admin view links */
            <>
              <Link to="/admin/dashboard" className="navbar-link" onClick={closeMenu}>
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
              </Link>
              <button type="button" onClick={handleLogout} className="navbar-logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            /* User / Guest view links */
            <>
              <Link to="/" className="navbar-link" onClick={closeMenu}>
                Catalog
              </Link>

              <Link to="/cart" className="navbar-link" onClick={closeMenu}>
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/order-history" className="navbar-link" onClick={closeMenu}>
                    <History size={18} />
                    <span>My Purchases</span>
                  </Link>

                  <Link to="/profile" className="navbar-link" onClick={closeMenu}>
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>

                  <button type="button" onClick={handleLogout} className="navbar-logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-link" onClick={closeMenu}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
