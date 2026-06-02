# 📂 Frontend Folder Structure

This document outlines the professional, scalable React directory structure designed for the **MERN E-Commerce Management System** as specified by the evaluation task requirements.

---

## 🏗️ Directory Hierarchy

Below is the directory tree for `Frontend/vite-project/src/`:

```
src/
├── assets/                 # Static visual assets (illustrations, placeholder images)
│
├── components/             # Highly reusable presentation components
│   ├── common/             # Global layout & form primitives
│   │   ├── Button.jsx      # Theme-styled button with hover states
│   │   ├── Input.jsx       # Label, validation, and error display wrapper
│   │   ├── Loader.jsx      # Full-page and inline loading spinners
│   │   ├── Alert.jsx       # Success, Warning, and Error flash banners
│   │   ├── Navbar.jsx      # Navigation bar (conditional User/Admin views)
│   │   ├── Footer.jsx      # Standard aesthetic footer
│   │   └── Modal.jsx       # Accessible popup dialog (e.g., delete confirmation)
│   │
│   ├── product/            # Product presentation components
│   │   ├── ProductCard.jsx # Grid card showing Image, Title, Price, Add to Cart
│   │   ├── ProductGrid.jsx # Responsive grid system for listings
│   │   └── FilterBar.jsx   # Search inputs and category selectors
│   │
│   ├── cart/               # Cart flow visual elements
│   │   ├── CartItem.jsx    # Horizontal row with quantity change actions
│   │   └── CartSummary.jsx # Pricing calculation breakdown (subtotal, total)
│   │
│   └── order/              # Checkout and invoice lists
│       ├── OrderCard.jsx   # Summary overview of a single completed order
│       └── OrderItem.jsx   # List of individual products bought in an order
│
├── context/                # Context API for Global State Management
│   ├── AuthContext.jsx     # Handles user auth state, login/logout, JWT storage
│   ├── CartContext.jsx     # Handles items in cart, quantity changes, additions
│   └── ProductContext.jsx  # Handles cached product lists and search status
│
├── hooks/                  # Custom reusable hooks (e.g., useDebounce for search)
│
├── layouts/                # Master wrapper templates containing Router Outlets
│   ├── UserLayout.jsx      # Standard layout with User Navbar + Footer
│   ├── AdminLayout.jsx     # Dashboard layout with Admin Sidebar + Header
│   └── AuthLayout.jsx      # Centered card layout for login/register pages
│
├── pages/                  # Route view containers (Full-page assemblies)
│   ├── auth/               # Authentication views
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── user/               # Standard user client interface
│   │   ├── Home.jsx        # Product catalog browser with grid and filters
│   │   ├── ProductDetails.jsx # Detailed details page with stock check
│   │   ├── Cart.jsx        # Cart checklist and action buttons
│   │   ├── Checkout.jsx    # Address entry and place order page
│   │   ├── OrderHistory.jsx # Completed past invoices listing
│   │   └── Profile.jsx     # Manage profile settings
│   │
│   └── admin/              # Restricted panel screens
│       ├── Dashboard.jsx   # Analytics cards showing totals
│       ├── ProductManagement.jsx # Create, Edit, and Delete inventory items
│       ├── UserManagement.jsx # List users, change roles, deactivate
│       └── OrderManagement.jsx # View and update status of customer orders
│
├── services/               # REST API communication client (Axios integrations)
│   ├── api.js              # Axios base instance with JWT interceptors
│   ├── authService.js      # login, register, forgot/reset routes
│   ├── productService.js   # CRUD operations for products
│   ├── cartService.js      # Synced Cart database updates
│   └── orderService.js     # Checkout API calls and invoices fetching
│
├── utils/                  # Universal utility helpers
│   ├── format.js           # Currency formatter, Date formatter helper
│   └── validation.js       # RegEx validators for forms
│
├── App.css                 # Global theme variables & responsive styles
├── App.jsx                 # Routes declaration using React Router DOM
├── index.css               # Base styles and CSS font imports
└── main.jsx                # Entry mount point
```

---

## 🛠️ Key Libraries Setup Recommendations

To construct this structure smoothly, run these commands inside the `vite-project` root:

```bash
# Add Routing, API calls, and Icon elements
npm install react-router-dom axios lucide-react
```

### 1. Global Axios Configuration (`services/api.js`)
Configured to automatically read the JWT key from `localStorage` and attach it to outgoing API requests:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
```

### 2. Route Declaration Sample (`App.jsx`)
Splitting layouts into public routes, private user routes, and protected admin routes:

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/user/Home';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Route components can be added to guard endpoints
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Group */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User Shop Group */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        {/* Admin Dashboard Group */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
```
