import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import OrderCard from '../../order/OrderCard';
import OrderItem from '../../order/OrderItem';
import Loader from '../../components/common/Loader';
import { History, Package } from 'lucide-react';

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
    return <Loader message="Loading Purchase History..." />;
  }

  return (
    <div className="container page-section">
      <div className="history-title-row">
        <div className="history-title-icon flex-center">
          <History size={24} />
        </div>
        <h1 className="history-title-heading">My Purchase History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="card empty-state-card">
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
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isExpanded={expandedOrderId === order._id}
              onToggleExpand={() => toggleExpand(order._id)}
            >
              <h4 className="order-details-title-heading">
                Invoiced Products ({order.items?.length || 0})
              </h4>
              <div className="order-details-items-list">
                {order.items?.map((item, idx) => (
                  <OrderItem key={idx} item={item} />
                ))}
              </div>
            </OrderCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
