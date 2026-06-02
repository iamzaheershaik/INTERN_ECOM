import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, User, LogOut, LayoutDashboard, History } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="global-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo-link">
          <div className="navbar-logo-icon">IE</div>
          <h2 className="navbar-logo-text">Intern Ecom</h2>
        </Link>

        {/* Dynamic Navigation Links */}
        <nav className="navbar-menu">
          {isAdmin ? (
            /* Admin view links */
            <>
              <Link to="/admin/dashboard" className="navbar-link">
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="navbar-logout-btn">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            /* User / Guest view links */
            <>
              <Link to="/" className="navbar-link">
                Catalog
              </Link>

              <Link to="/cart" className="navbar-link">
                <ShoppingCart size={18} />
                <span>Cart</span>
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/order-history" className="navbar-link">
                    <History size={18} />
                    <span>My Purchases</span>
                  </Link>

                  <Link to="/profile" className="navbar-link">
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>

                  <button onClick={handleLogout} className="navbar-logout-btn">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-link">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
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
