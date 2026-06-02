import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import { History, Calendar, DollarSign, Package, ChevronDown, ChevronUp } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getOrders();
        if (response?.data) {
          // Sort by newest first
          setOrders(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (err) {
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#f3f4f6', color: '#4b5563', label: 'Pending Payment' };
      case 'processing':
        return { bg: '#fef3c7', color: '#d97706', label: 'Processing' };
      case 'shipped':
        return { bg: '#dbeafe', color: '#2563eb', label: 'Shipped Out' };
      case 'delivered':
        return { bg: '#dcfce7', color: '#16a34a', label: 'Delivered' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#dc2626', label: 'Cancelled' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', label: status };
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading Purchase History...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="history-title-row">
        <div className="history-title-icon flex-center">
          <History size={24} />
        </div>
        <h1 className="history-title-heading">My Purchase History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '64px', textAlign: 'center', borderRadius: '16px' }}>
          <div className="flex-center" style={{ width: '64px', height: '64px', background: 'var(--color-bg-alt)', color: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 20px auto' }}>
            <Package size={28} />
          </div>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>No Orders Found</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '15px' }}>
            It looks like you haven't made any purchases on our platform yet.
          </p>
          <Link to="/" className="btn-primary">
            Start Shopping Catalog
          </Link>
        </div>
      ) : (
        <div className="history-list-cards">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const statusConfig = getStatusStyle(order.status);
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={order._id} className="card order-card-wrapper">
                {/* Header overview row */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="order-header-summary"
                  style={{ background: isExpanded ? 'var(--color-bg-alt)' : 'transparent' }}
                >
                  <div className="order-meta-info-grid">
                    {/* Order ID */}
                    <div className="order-meta-info-item">
                      <span className="order-meta-info-label">Order Ref</span>
                      <strong className="order-meta-info-value">#{order._id}</strong>
                    </div>

                    {/* Date */}
                    <div className="order-meta-info-item">
                      <span className="order-meta-info-label">Purchase Date</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', marginTop: '2px', fontWeight: 500 }}>
                        <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                        <span>{orderDate}</span>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="order-meta-info-item">
                      <span className="order-meta-info-label">Total Paid</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '16px', marginTop: '2px', fontWeight: 800, color: 'var(--color-primary)' }}>
                        <DollarSign size={15} />
                        <span>{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right hand details button and badge */}
                  <div className="order-status-badge-wrap">
                    <span
                      style={{
                        background: statusConfig.bg,
                        color: statusConfig.color,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                      }}
                    >
                      {statusConfig.label}
                    </span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Sub items collapsible section */}
                {isExpanded && (
                  <div className="order-collapsible-details">
                    <h4 className="order-details-title-heading">
                      Invoiced Products ({order.items?.length || 0})
                    </h4>
                    <div className="order-details-items-list">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-details-item-row">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="order-details-qty-badge">{item.quantity}</span>
                            <span className="order-details-item-name">{item.name}</span>
                          </div>
                          <span className="order-details-item-total">
                            ${(item.price * item.quantity).toFixed(2)} <span className="order-details-item-unitprice">(${item.price.toFixed(2)} each)</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
