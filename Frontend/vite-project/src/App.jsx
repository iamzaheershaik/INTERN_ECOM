import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Global Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UIProvider, useUI } from './context/UIContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';

// User Pages
import Home from './pages/user/Home';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderHistory from './pages/user/OrderHistory';
import Profile from './pages/user/Profile';

// User Pages (V2)
import V2Home from './v2/pages/Home';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';

// V2 Theme styles
import './v2/v2.css';

const HomeConditional = () => {
  const { uiVersion } = useUI();
  return uiVersion === 'v2' ? <V2Home /> : <Home />;
};

const AppContent = () => {
  const { uiVersion } = useUI();
  const isV2Route = window.location.pathname.startsWith('/v2');
  const isV2Active = uiVersion === 'v2' || isV2Route;

  return (
    <div className={isV2Active ? 'v2-theme' : ''}>
      <Router>
        <Routes>
          {/* Authentication Layout Group */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
          </Route>

          {/* General Shopping Layout Group */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomeConditional />} />
            <Route path="/v2" element={<V2Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Administrative Panel Layout Group */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

const App = () => {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default App;
