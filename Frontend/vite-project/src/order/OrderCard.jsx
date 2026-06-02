import React from 'react';
import { Calendar, IndianRupee, ChevronDown, ChevronUp } from 'lucide-react';

const OrderCard = ({
  order,
  isExpanded = false,
  onToggleExpand,
  children
}) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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

  const statusConfig = getStatusStyle(order.status);

  return (
    <div className="card order-card-wrapper">
      {/* Header overview row */}
      <div
        onClick={onToggleExpand}
        className="order-header-summary"
        style={{ background: isExpanded ? 'var(--color-bg-alt)' : 'transparent', cursor: 'pointer' }}
      >
        <div className="order-meta-info-grid">
          {/* Order ID */}
          <div className="order-meta-info-item">
            <span className="order-meta-info-label">Order Ref</span>
            <strong className="order-meta-info-value" style={{ fontFamily: 'monospace' }}>#{order._id}</strong>
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
              <IndianRupee size={15} />
              <span>{order.totalAmount?.toLocaleString('en-IN')}</span>
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
          {children}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
