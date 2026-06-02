import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import productService from '../../services/productService';
import { Users, ShoppingBag, CreditCard, IndianRupee, RefreshCw, Sparkles, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  // Group related states to avoid multiple rendering cycles
  const [state, setState] = useState({
    stats: null,
    recentOrders: [],
    loading: true,
    seedLoading: false,
    seedSuccess: false,
  });

  const { stats, recentOrders, loading, seedLoading, seedSuccess } = state;

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response?.data) {
        setState((prev) => ({
          ...prev,
          stats: response.data.stats,
          recentOrders: response.data.recentOrders || [],
          loading: false,
        }));
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeedProducts = async () => {
    setState((prev) => ({ ...prev, seedLoading: true, seedSuccess: false }));

    const demoProducts = [
      {
        name: 'Wireless Mechanical Keyboard',
        description: 'Ergonomic 75% mechanical keyboard with custom linear switches and RGB backlighting.',
        price: 10999,
        quantity: 50,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'active',
      },
      {
        name: 'Active Noise Cancelling Headphones',
        description: 'High-fidelity active noise-cancelling over-ear headphones with 30-hour battery life.',
        price: 19999,
        quantity: 35,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'active',
      },
      {
        name: 'Ergonomic Premium Office Chair',
        description: 'Breathable mesh office chair with adaptive lumbar support and multi-angle adjustable armrests.',
        price: 28999,
        quantity: 15,
        category: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1589384267710-7a259678a59a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'active',
      },
      {
        name: 'Handcrafted Slim Leather Wallet',
        description: 'Handcrafted full-grain leather bi-fold wallet featuring secure RFID blocking protection.',
        price: 3999,
        quantity: 100,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1627124765135-568b3f6f1c4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'active',
      },
      {
        name: 'Double-Walled Aesthetic Water Bottle',
        description: 'Double-walled vacuum-insulated stainless steel water bottle, keeping cold for 24h.',
        price: 2499,
        quantity: 150,
        category: 'Fitness',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'active',
      },
      {
        name: 'Smart OLED Fitness Tracker',
        description: 'Water-resistant health tracker monitoring heart-rate, active calories, and sleep cycles.',
        price: 6999,
        quantity: 75,
        category: 'Fitness',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        status: 'active',
      },
    ];

    try {
      for (const prod of demoProducts) {
        await productService.createProduct(prod);
      }
      setState((prev) => ({ ...prev, seedSuccess: true, seedLoading: false }));
      await fetchStats();
      setTimeout(() => {
        setState((prev) => ({ ...prev, seedSuccess: false }));
      }, 3000);
    } catch (err) {
      console.error('Error seeding demo products:', err);
      setState((prev) => ({ ...prev, seedLoading: false }));
    }
  };

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#f3f4f6', color: '#4b5563' };
      case 'processing':
        return { bg: '#fef3c7', color: '#d97706' };
      case 'shipped':
        return { bg: '#dbeafe', color: '#2563eb' };
      case 'delivered':
        return { bg: '#dcfce7', color: '#16a34a' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#dc2626' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563' };
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Title Header */}
      <div className="admin-dashboard-container">
        <div>
          <h1 className="admin-header-title">Analytics Overview</h1>
          <p className="admin-header-desc">
            Real-time business performance indicators and stock logs.
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" onClick={fetchStats} className="admin-action-btn">
            <RefreshCw size={16} />
            <span>Reload Stats</span>
          </button>

          <button
            type="button"
            onClick={handleSeedProducts}
            disabled={seedLoading}
            className="btn-primary"
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              gap: '8px',
            }}
          >
            <Sparkles size={16} />
            <span>{seedLoading ? 'Injecting Items...' : 'Seed Demo Products'}</span>
          </button>
        </div>
      </div>

      {seedSuccess && (
        <div style={{ background: '#f0fdf4', color: 'var(--color-success)', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }} className="flex-center">
          <CheckCircle size={16} style={{ marginRight: '8px' }} />
          <span>Demo items injected successfully! Refreshing dashboard metrics...</span>
        </div>
      )}

      {/* Grid of 4 Stat Cards */}
      <div className="admin-stats-grid">
        {/* Users */}
        <div className="card admin-stat-card" style={{ borderLeft: '6px solid var(--color-primary)' }}>
          <div>
            <p className="admin-stat-label">Total Accounts</p>
            <h2 className="admin-stat-number">{stats?.totalUsers || 0}</h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: 'var(--color-bg-alt)', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
        </div>

        {/* Products */}
        <div className="card admin-stat-card" style={{ borderLeft: '6px solid var(--color-success)' }}>
          <div>
            <p className="admin-stat-label">Active Catalog</p>
            <h2 className="admin-stat-number">{stats?.totalProducts || 0}</h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: '#dcfce7', color: 'var(--color-success)' }}>
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Orders */}
        <div className="card admin-stat-card" style={{ borderLeft: '6px solid #3b82f6' }}>
          <div>
            <p className="admin-stat-label">Total Orders</p>
            <h2 className="admin-stat-number">{stats?.totalOrders || 0}</h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <CreditCard size={24} />
          </div>
        </div>

        {/* Revenue */}
        <div className="card admin-stat-card" style={{ borderLeft: '6px solid #f59e0b' }}>
          <div>
            <p className="admin-stat-label">Gross Earnings</p>
            <h2 className="admin-stat-number">₹{stats?.totalRevenue?.toLocaleString('en-IN') || '0'}</h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: '#fef3c7', color: '#d97706' }}>
            <IndianRupee size={24} />
          </div>
        </div>
      </div>

      {/* Recent Orders log */}
      <div className="card admin-recent-orders-card">
        <h3 className="admin-recent-orders-title">Recent Purchases Log</h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
            No customer purchases logged in the database yet.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr className="admin-table-header-row">
                  <th className="admin-table-cell">ORDER ID</th>
                  <th className="admin-table-cell">CUSTOMER</th>
                  <th className="admin-table-cell">DATE</th>
                  <th className="admin-table-cell">REVENUE</th>
                  <th className="admin-table-cell">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const client = order.userId || {};
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const statusColors = getOrderStatusStyle(order.status);
                  return (
                    <tr key={order._id} className="admin-table-body-row">
                      <td className="admin-table-cell admin-table-cell-bold">
                        #{order._id.substring(0, 10)}...
                      </td>
                      <td className="admin-table-cell">
                        <div style={{ fontWeight: 600 }}>{client.firstName ? `${client.firstName} ${client.lastName}` : 'Guest User'}</div>
                        <span className="admin-table-cell-muted">{client.email || 'N/A'}</span>
                      </td>
                      <td className="admin-table-cell" style={{ color: 'var(--color-text-muted)' }}>{orderDate}</td>
                      <td className="admin-table-cell" style={{ fontWeight: 700 }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="admin-table-cell">
                        <span
                          style={{
                            background: statusColors.bg,
                            color: statusColors.color,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 700,
                            textTransform: 'capitalize',
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
