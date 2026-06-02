import React from 'react';

const OrderItem = ({ item }) => {
  return (
    <div className="order-details-item-row">
      {/* Product Quantity and Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="order-details-qty-badge">{item.quantity}</span>
        <span className="order-details-item-name">{item.name}</span>
      </div>

      {/* Pricing detail subtotals */}
      <span className="order-details-item-total">
        ₹{((item.price || 0) * (item.quantity || 0)).toLocaleString('en-IN')}{' '}
        <span className="order-details-item-unitprice">
          (₹{item.price?.toLocaleString('en-IN')} each)
        </span>
      </span>
    </div>
  );
};

export default OrderItem;
