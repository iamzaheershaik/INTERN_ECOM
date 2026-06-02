import React, { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import { 
  ClipboardList, 
  Calendar, 
  IndianRupee, 
  Package, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Truck,
  AlertCircle
} from 'lucide-react';

const OrderManagement = () => {
  // Group all states into a single unified state object to avoid many useState triggers
  const [state, setState] = useState({
    orders: [],
    loading: true,
    error: '',
    successMsg: '',
    updatingId: null,
    searchQuery: '',
    statusFilter: 'all',
    expandedOrderId: null,
  });

  const {
    orders,
    loading,
    error,
    successMsg,
    updatingId,
    searchQuery,
    statusFilter,
    expandedOrderId,
  } = state;

  const fetchOrders = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await orderService.getOrders();
      if (response?.data) {
        setState((prev) => ({ ...prev, orders: response.data, loading: false }));
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setState((prev) => ({ ...prev, error: 'Failed to retrieve system order invoices.', loading: false }));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setState((prev) => ({ ...prev, error: '', successMsg: '', updatingId: orderId }));
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      if (response?.data) {
        setState((prev) => ({
          ...prev,
          successMsg: `Order #${orderId} status successfully transitioned to "${newStatus}".`,
          orders: prev.orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          ),
          updatingId: null
        }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, successMsg: '' }));
        }, 4000);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setState((prev) => ({
        ...prev,
        error: err.response?.data?.message || err.message || 'Status transition failed.',
        updatingId: null
      }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, error: '' }));
      }, 4000);
    }
  };

  const toggleExpand = (id) => {
    setState((prev) => ({
      ...prev,
      expandedOrderId: prev.expandedOrderId === id ? null : id,
    }));
  };

  // Calculated Stats
  const stats = {
    totalOrders: orders.length,
    totalSales: orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0),
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const getStatusColorConfig = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb', label: 'Pending Payment' };
      case 'processing':
        return { bg: '#fef3c7', color: '#d97706', border: '#fde68a', label: 'Processing' };
      case 'shipped':
        return { bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe', label: 'Shipped Out' };
      case 'delivered':
        return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0', label: 'Delivered' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca', label: 'Cancelled' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb', label: status };
    }
  };

  // Search & Filter computation
  const filteredOrders = orders.filter(order => {
    // Status Filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    // Text Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const orderId = (order._id || '').toLowerCase();
      
      const buyer = order.userId || {};
      const buyerName = `${buyer.firstName || ''} ${buyer.lastName || ''}`.toLowerCase();
      const buyerEmail = (buyer.email || '').toLowerCase();
      
      const matchesProducts = order.items?.some(item => 
        (item.name || '').toLowerCase().includes(query)
      );

      return (
        orderId.includes(query) ||
        buyerName.includes(query) ||
        buyerEmail.includes(query) ||
        matchesProducts
      );
    }
    return true;
  });

  return (
    <div>
      {/* Title Header */}
      <div className="admin-dashboard-container">
        <div>
          <h1 className="admin-header-title">Customer Order Desk</h1>
          <p className="admin-header-desc">
            Monitor product checkout logs, review invoice item lists, and transition order dispatch states.
          </p>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="admin-stats-grid">
        {/* Metric Card - Total Sales */}
        <div className="card admin-stat-card">
          <div>
            <span className="admin-stat-label">Aggregated Revenue</span>
            <h2 className="admin-stat-number" style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)', fontWeight: 800 }}>
              <IndianRupee size={24} style={{ marginRight: '2px' }} />
              {stats.totalSales.toLocaleString('en-IN')}
            </h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: 'var(--color-bg-alt)', color: 'var(--color-primary)' }}>
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Metric Card - Total Orders */}
        <div className="card admin-stat-card">
          <div>
            <span className="admin-stat-label">Total Invoices</span>
            <h2 className="admin-stat-number">{stats.totalOrders} items</h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: '#e9d5ff', color: 'var(--color-text-muted)' }}>
            <ClipboardList size={24} />
          </div>
        </div>

        {/* Metric Card - Processing count */}
        <div className="card admin-stat-card">
          <div>
            <span className="admin-stat-label">Processing</span>
            <h2 className="admin-stat-number" style={{ color: '#d97706' }}>{stats.processing} items</h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
        </div>

        {/* Metric Card - Pending Payment */}
        <div className="card admin-stat-card">
          <div>
            <span className="admin-stat-label">Pending</span>
            <h2 className="admin-stat-number" style={{ color: '#4b5563' }}>{stats.pending} items</h2>
          </div>
          <div className="admin-stat-icon-box flex-center" style={{ background: '#f3f4f6', color: '#4b5563' }}>
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: '#f0fdf4', color: 'var(--color-success)', border: '1px solid #bbf7d0', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', color: 'var(--color-danger)', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Dynamic Filtering Tab-bar & Search Box */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
        {/* Tabs Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'pending', label: 'Pending' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => { setState(prev => ({ ...prev, statusFilter: tab.id, expandedOrderId: null })); }}
              className={`sidebar-btn ${statusFilter === tab.id ? 'sidebar-btn-active' : ''}`}
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}
            >
              {tab.label}
              {tab.id !== 'all' && (
                <span style={{ fontSize: '11px', fontWeight: 700, marginLeft: '6px', opacity: 0.8 }}>
                  ({stats[tab.id]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Text Search Box */}
        <div className="search-form-wrap" style={{ maxWidth: '300px', margin: 0 }}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search reference, buyer, product..."
            value={searchQuery}
            onChange={(e) => { setState(prev => ({ ...prev, searchQuery: e.target.value, expandedOrderId: null })); }}
          />
        </div>
      </div>

      {/* Main Order Desk Sheet */}
      <div className="card admin-recent-orders-card">
        {loading ? (
          <div className="flex-center" style={{ padding: '64px 0', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Retrieving system order registry...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', padding: '48px 0' }}>
            No orders match the status filter or search parameters.
          </p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-data-table">
              <thead>
                <tr className="admin-table-header-row">
                  <th className="admin-table-cell" style={{ width: '20px' }}></th>
                  <th className="admin-table-cell">ORDER REF</th>
                  <th className="admin-table-cell">BUYER PROFILE</th>
                  <th className="admin-table-cell">ORDER DATE</th>
                  <th className="admin-table-cell">TOTAL AMOUNT</th>
                  <th className="admin-table-cell">CURRENT STATUS</th>
                  <th className="admin-table-cell" style={{ textAlign: 'right' }}>TRANSITION STATE</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order._id;
                  const statusConfig = getStatusColorConfig(order.status);
                  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const buyer = order.userId || {};
                  const isUpdating = updatingId === order._id;

                  return (
                    <React.Fragment key={order._id}>
                      {/* Master Row */}
                      <tr className="admin-table-body-row" style={{ cursor: 'pointer', background: isExpanded ? 'var(--color-bg-main)' : 'transparent' }}>
                        <td className="admin-table-cell" onClick={() => toggleExpand(order._id)}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </td>
                        
                        <td className="admin-table-cell" onClick={() => toggleExpand(order._id)}>
                          <strong style={{ color: 'var(--color-text-main)', fontSize: '13px', fontFamily: 'monospace' }}>
                            #{order._id}
                          </strong>
                        </td>

                        <td className="admin-table-cell" onClick={() => toggleExpand(order._id)}>
                          <div>
                            <strong style={{ color: 'var(--color-text-main)' }}>
                              {buyer.firstName ? `${buyer.firstName} ${buyer.lastName}` : 'Guest Customer'}
                            </strong>
                            <span className="admin-table-cell-muted" style={{ display: 'block', marginTop: '2px' }}>
                              {buyer.email || 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td className="admin-table-cell" onClick={() => toggleExpand(order._id)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                            <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
                            <span>{orderDate}</span>
                          </div>
                        </td>

                        <td className="admin-table-cell" onClick={() => toggleExpand(order._id)}>
                          <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '15px' }}>
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </td>

                        <td className="admin-table-cell" onClick={() => toggleExpand(order._id)}>
                          <span
                            style={{
                              background: statusConfig.bg,
                              color: statusConfig.color,
                              border: `1px solid ${statusConfig.border}`,
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                            }}
                          >
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Transition drop-down */}
                        <td className="admin-table-cell" style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            {isUpdating ? (
                              <div style={{ width: '16px', height: '16px', border: '2px solid var(--color-border)', borderTop: '2px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            ) : (
                              <select
                                className="sort-select-dropdown"
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                style={{ padding: '6px 12px', fontSize: '12px', border: '1px solid var(--color-border)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '6px', cursor: 'pointer', background: 'var(--color-bg-card)', fontWeight: 600 }}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Collapsible Sub-item Panel */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ background: '#fcfaff', padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
                            <div style={{ padding: '8px 16px', background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                              <h4 style={{ fontSize: '15px', color: 'var(--color-text-main)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={16} style={{ color: 'var(--color-primary)' }} />
                                <span>Invoiced Items Detail ({order.items?.length || 0})</span>
                              </h4>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {order.items?.map((item, index) => (
                                  <div 
                                    key={index} 
                                    style={{ 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center', 
                                      fontSize: '13px', 
                                      padding: '8px 12px', 
                                      borderRadius: '8px', 
                                      background: 'var(--color-bg-main)',
                                      border: '1px dashed var(--color-border)' 
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <span className="order-details-qty-badge" style={{ padding: '2px 8px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, borderRadius: '4px', fontSize: '11px' }}>
                                        {item.quantity}x
                                      </span>
                                      <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{item.name}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <strong style={{ color: 'var(--color-text-main)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                        (₹{item.price.toLocaleString('en-IN')} each)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                  Payment Provider: <strong style={{ color: 'var(--color-text-main)' }}>COD / Manual Wallet</strong>
                                </div>
                                <div>
                                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginRight: '8px' }}>Total Invoice Amount:</span>
                                  <strong style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 800 }}>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default OrderManagement;
