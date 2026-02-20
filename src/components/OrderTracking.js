import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

function OrderTracking({ onClose }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const searchOrders = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const allOrders = await orderService.getAllOrders();
      const userOrders = allOrders.filter(order => 
        order.customerPhone === mobileNumber
      );
      setOrders(userOrders);
      setSearched(true);
      
      if (userOrders.length === 0) {
        toast('No orders found for this number', {
          icon: 'ℹ️',
        });
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      toast.error('Failed to search orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#f1c40f', text: '⏳ Preparing', icon: '👨‍🍳' },
      completed: { color: '#2ecc71', text: '✅ Delivered', icon: '📦' },
      cancelled: { color: '#e74c3c', text: '❌ Cancelled', icon: '🚫' }
    };
    
    const config = statusConfig[status] || { color: '#808080', text: status, icon: '📋' };
    
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        backgroundColor: config.color + '20',
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}>
        <span>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getDeliveryMessage = (order) => {
    if (order.status === 'completed') {
      return '✅ Delivered';
    }
    if (order.status === 'cancelled') {
      return '❌ Cancelled';
    }
    
    // Calculate estimated delivery time (40 minutes from order time)
    const orderTime = new Date(order.createdAt);
    const deliveryTime = new Date(orderTime.getTime() + 40 * 60000);
    const now = new Date();
    
    if (now > deliveryTime) {
      return '🚚 Should arrive any moment';
    }
    
    const minutesLeft = Math.round((deliveryTime - now) / 60000);
    if (minutesLeft <= 0) {
      return '🚚 Should arrive any moment';
    }
    
    return `🚚 Delivering in ~${minutesLeft} minutes`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    },
    modal: {
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    header: {
      padding: '20px 24px',
      borderBottom: '1px solid #2a2a2a',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#D4AF37',
      margin: 0,
    },
    closeBtn: {
      background: 'transparent',
      border: 'none',
      color: '#808080',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px 8px',
      borderRadius: '4px',
    },
    searchSection: {
      padding: '20px 24px',
      borderBottom: '1px solid #2a2a2a',
    },
    inputGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
    },
    searchBtn: {
      padding: '12px 24px',
      background: '#D4AF37',
      border: 'none',
      borderRadius: '8px',
      color: '#111111',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    ordersList: {
      padding: '20px 24px',
    },
    orderCard: {
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      cursor: 'pointer',
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    orderId: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffffff',
    },
    orderDate: {
      fontSize: '11px',
      color: '#808080',
    },
    orderDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
      marginBottom: '12px',
    },
    detailItem: {
      fontSize: '12px',
    },
    detailLabel: {
      color: '#808080',
      marginRight: '4px',
    },
    detailValue: {
      color: '#e0e0e0',
    },
    itemsPreview: {
      fontSize: '11px',
      color: '#a0a0a0',
      marginBottom: '12px',
      padding: '8px',
      background: '#111111',
      borderRadius: '4px',
    },
    deliveryStatus: {
      padding: '8px 12px',
      background: '#111111',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      marginTop: '8px',
    },
    viewDetailsBtn: {
      width: '100%',
      padding: '8px',
      background: '#2a2a2a',
      border: 'none',
      borderRadius: '4px',
      color: '#ffffff',
      fontSize: '12px',
      cursor: 'pointer',
      marginTop: '8px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#808080',
      fontSize: '14px',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#808080',
    },
    modalDetails: {
      padding: '20px 24px',
    },
    detailRow: {
      display: 'flex',
      marginBottom: '12px',
      fontSize: '13px',
    },
    detailLabel2: {
      width: '100px',
      color: '#808080',
    },
    detailValue2: {
      flex: 1,
      color: '#ffffff',
    },
    itemsList: {
      background: '#1a1a1a',
      padding: '12px',
      borderRadius: '6px',
      marginTop: '12px',
    },
    itemRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px',
      fontSize: '12px',
    },
    backBtn: {
      padding: '8px 16px',
      background: 'transparent',
      border: '1px solid #2a2a2a',
      borderRadius: '4px',
      color: '#808080',
      cursor: 'pointer',
      fontSize: '12px',
      marginBottom: '16px',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.overlay}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <h2 style={styles.title}>🔍 Track Your Orders</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.searchSection}>
          <div style={styles.inputGroup}>
            <input
              type="tel"
              placeholder="Enter your 10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              style={styles.input}
              maxLength="10"
            />
            <button 
              style={styles.searchBtn}
              onClick={searchOrders}
              disabled={loading}
            >
              {loading ? '🔍...' : 'Search'}
            </button>
          </div>
          <p style={{ fontSize: '10px', color: '#606060', marginTop: '8px' }}>
            Enter the mobile number you used to place orders
          </p>
        </div>

        <div style={styles.ordersList}>
          {loading ? (
            <div style={styles.loading}>Searching orders...</div>
          ) : searched && orders.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
              <div>No orders found for this number</div>
              <p style={{ fontSize: '11px', color: '#606060', marginTop: '8px' }}>
                Try another number or place a new order
              </p>
            </div>
          ) : selectedOrder ? (
            // Order Details View
            <div>
              <button 
                style={styles.backBtn}
                onClick={() => setSelectedOrder(null)}
              >
                ← Back to all orders
              </button>
              
              <div style={styles.modalDetails}>
                <h3 style={{ fontSize: '16px', color: '#D4AF37', marginBottom: '16px' }}>
                  Order #{selectedOrder.orderId}
                </h3>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel2}>Status:</span>
                  <span style={styles.detailValue2}>{getStatusBadge(selectedOrder.status)}</span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel2}>Date:</span>
                  <span style={styles.detailValue2}>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel2}>Payment:</span>
                  <span style={styles.detailValue2}>{selectedOrder.paymentMethod || 'Cash on Delivery'}</span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel2}>Delivery:</span>
                  <span style={{...styles.detailValue2, color: getDeliveryMessage(selectedOrder).includes('✅') ? '#2ecc71' : '#f1c40f'}}>
                    {getDeliveryMessage(selectedOrder)}
                  </span>
                </div>

                <div style={styles.itemsList}>
                  <div style={{ color: '#D4AF37', marginBottom: '8px', fontSize: '12px' }}>Items:</div>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={styles.itemRow}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div style={{ 
                    ...styles.itemRow, 
                    marginTop: '8px', 
                    paddingTop: '8px', 
                    borderTop: '1px solid #2a2a2a',
                    fontWeight: '600'
                  }}>
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ color: '#808080', fontSize: '11px', marginBottom: '4px' }}>Delivery Address:</div>
                  <div style={{ fontSize: '12px', color: '#e0e0e0' }}>{selectedOrder.address}</div>
                </div>
              </div>
            </div>
          ) : (
            // Orders List View
            orders.map((order) => (
              <motion.div
                key={order.id}
                style={styles.orderCard}
                whileHover={{ borderColor: '#404040' }}
                onClick={() => setSelectedOrder(order)}
              >
                <div style={styles.orderHeader}>
                  <span style={styles.orderId}>#{order.orderId}</span>
                  {getStatusBadge(order.status)}
                </div>

                <div style={styles.orderDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>💰</span>
                    <span style={styles.detailValue}>₹{order.total}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>📅</span>
                    <span style={styles.detailValue}>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div style={styles.itemsPreview}>
                    {order.items.slice(0, 2).map((item, i) => (
                      <div key={i}>• {item.name} x{item.quantity}</div>
                    ))}
                    {order.items.length > 2 && (
                      <div style={{ color: '#606060' }}>+{order.items.length - 2} more items</div>
                    )}
                  </div>
                )}

                <div style={{
                  ...styles.deliveryStatus,
                  color: order.status === 'completed' ? '#2ecc71' : 
                         order.status === 'cancelled' ? '#e74c3c' : '#f1c40f'
                }}>
                  {getDeliveryMessage(order)}
                </div>

                <button style={styles.viewDetailsBtn}>
                  View Details →
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default OrderTracking;