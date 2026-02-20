import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    totalEarnings: 0,
    todayEarnings: 0
  });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, searchTerm, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
      setFilteredOrders(allOrders);
      
      const statsData = await orderService.getStats();
      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter);
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter(order => 
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm) ||
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await orderService.updateStatus(id, newStatus);
    if (result.success) {
      toast.success(`✅ Order marked as ${newStatus}`);
      loadOrders();
    } else {
      toast.error('❌ Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const result = await orderService.deleteOrder(id);
      if (result.success) {
        toast.success('✅ Order deleted');
        loadOrders();
        if (selectedOrder?.id === id) {
          setSelectedOrder(null);
        }
      } else {
        toast.error('❌ Failed to delete order');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f1c40f';
      case 'completed': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  // Professional Black Theme Styles
  const styles = {
    container: {
      padding: '24px',
      background: '#0a0a0a',
      minHeight: '100vh',
      color: '#e0e0e0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    header: {
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '20px 24px',
      marginBottom: '24px',
    },
    title: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '500',
      color: '#ffffff',
      letterSpacing: '0.3px',
    },
    subtitle: {
      margin: '4px 0 0',
      fontSize: '12px',
      color: '#808080',
      fontWeight: '400',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    },
    statCard: {
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '16px',
    },
    statIcon: {
      fontSize: '18px',
      color: '#808080',
      marginBottom: '8px',
    },
    statNumber: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '2px',
    },
    statLabel: {
      fontSize: '11px',
      color: '#808080',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    filterSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    filterTabs: {
      display: 'flex',
      gap: '6px',
      background: '#111111',
      padding: '4px',
      borderRadius: '6px',
      border: '1px solid #2a2a2a',
    },
    filterTab: {
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '500',
      background: 'transparent',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#808080',
      transition: 'all 0.2s',
    },
    activeFilter: {
      background: '#2a2a2a',
      color: '#ffffff',
    },
    searchBox: {
      padding: '8px 12px',
      fontSize: '12px',
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '6px',
      color: '#ffffff',
      width: '260px',
      outline: 'none',
    },
    ordersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: '16px',
    },
    orderCard: {
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    orderId: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#ffffff',
      letterSpacing: '0.3px',
    },
    statusBadge: {
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    orderDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '6px',
      fontSize: '12px',
      color: '#b0b0b0',
    },
    detailIcon: {
      fontSize: '12px',
      color: '#808080',
      width: '16px',
    },
    detailText: {
      fontSize: '12px',
      color: '#e0e0e0',
    },
    itemsPreview: {
      marginTop: '10px',
      padding: '8px',
      background: '#0a0a0a',
      borderRadius: '4px',
      fontSize: '11px',
      color: '#a0a0a0',
    },
    actionButtons: {
      display: 'flex',
      gap: '6px',
      marginTop: '14px',
      borderTop: '1px solid #2a2a2a',
      paddingTop: '12px',
    },
    button: {
      padding: '4px 10px',
      fontSize: '11px',
      fontWeight: '500',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    viewBtn: {
      background: '#2a2a2a',
      color: '#ffffff',
    },
    completeBtn: {
      background: '#2ecc71',
      color: '#ffffff',
    },
    cancelBtn: {
      background: '#f1c40f',
      color: '#000000',
    },
    deleteBtn: {
      background: '#e74c3c',
      color: '#ffffff',
    },
    loading: {
      textAlign: 'center',
      padding: '60px',
      fontSize: '13px',
      color: '#808080',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px',
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      color: '#808080',
      fontSize: '13px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: '#111111',
      border: '1px solid #2a2a2a',
      borderRadius: '8px',
      padding: '24px',
      width: '90%',
      maxWidth: '480px',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    modalTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid #2a2a2a',
    },
    modalContent: {
      fontSize: '12px',
      color: '#b0b0b0',
      lineHeight: '1.8',
    },
    modalRow: {
      display: 'flex',
      marginBottom: '8px',
    },
    modalLabel: {
      width: '100px',
      color: '#808080',
    },
    modalValue: {
      flex: 1,
      color: '#ffffff',
    },
    modalItems: {
      marginTop: '12px',
      padding: '12px',
      background: '#0a0a0a',
      borderRadius: '4px',
    },
    modalCloseBtn: {
      width: '100%',
      padding: '10px',
      background: '#2a2a2a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '20px',
      fontSize: '12px',
      fontWeight: '500',
    },
  };

  if (loading) {
    return <div style={styles.loading}>Loading orders...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 YFC ADMIN</h1>
        <p style={styles.subtitle}>Order Management Dashboard</p>
      </div>

      {/* Statistics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Orders</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div style={{...styles.statNumber, color: '#f1c40f'}}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={{...styles.statNumber, color: '#2ecc71'}}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>❌</div>
          <div style={{...styles.statNumber, color: '#e74c3c'}}>{stats.cancelled}</div>
          <div style={styles.statLabel}>Cancelled</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statNumber}>₹{stats.totalEarnings || 0}</div>
          <div style={styles.statLabel}>Total Earnings</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statNumber}>₹{stats.todayEarnings || 0}</div>
          <div style={styles.statLabel}>Today's Earnings</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.filterTabs}>
          <button
            style={{...styles.filterTab, ...(filter === 'all' ? styles.activeFilter : {})}}
            onClick={() => setFilter('all')}
          >
            ALL ({stats.total})
          </button>
          <button
            style={{...styles.filterTab, ...(filter === 'pending' ? styles.activeFilter : {})}}
            onClick={() => setFilter('pending')}
          >
            PENDING ({stats.pending})
          </button>
          <button
            style={{...styles.filterTab, ...(filter === 'completed' ? styles.activeFilter : {})}}
            onClick={() => setFilter('completed')}
          >
            COMPLETED ({stats.completed})
          </button>
          <button
            style={{...styles.filterTab, ...(filter === 'cancelled' ? styles.activeFilter : {})}}
            onClick={() => setFilter('cancelled')}
          >
            CANCELLED ({stats.cancelled})
          </button>
        </div>
        <input
          type="text"
          placeholder="🔍 Search by name, phone or ID..."
          style={styles.searchBox}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ marginBottom: '8px' }}>📭 No orders found</div>
          <div style={{ fontSize: '11px', color: '#606060' }}>
            {orders.length === 0 ? 'No orders have been placed yet' : 'Try adjusting your filters'}
          </div>
        </div>
      ) : (
        <div style={styles.ordersGrid}>
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              style={styles.orderCard}
              whileHover={{ y: -2, borderColor: '#404040' }}
              onClick={() => setSelectedOrder(order)}
            >
              <div style={styles.orderHeader}>
                <span style={styles.orderId}>#{order.orderId}</span>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusColor(order.status) + '20',
                  color: getStatusColor(order.status),
                  border: `1px solid ${getStatusColor(order.status)}40`,
                }}>
                  {order.status}
                </span>
              </div>

              <div style={styles.orderDetail}>
                <span style={styles.detailIcon}>👤</span>
                <span style={styles.detailText}>{order.customerName}</span>
              </div>
              
              <div style={styles.orderDetail}>
                <span style={styles.detailIcon}>📱</span>
                <span style={styles.detailText}>+91 {order.customerPhone}</span>
              </div>
              
              <div style={styles.orderDetail}>
                <span style={styles.detailIcon}>💰</span>
                <span style={styles.detailText}>₹{order.total}</span>
              </div>
              
              <div style={styles.orderDetail}>
                <span style={styles.detailIcon}>🕒</span>
                <span style={styles.detailText}>{formatDate(order.createdAt)}</span>
              </div>

              {order.items && order.items.length > 0 && (
                <div style={styles.itemsPreview}>
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i}>• {item.name} x{item.quantity}</div>
                  ))}
                  {order.items.length > 2 && (
                    <div style={{ color: '#606060', marginTop: '4px' }}>
                      +{order.items.length - 2} more items
                    </div>
                  )}
                </div>
              )}

              <div style={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                <button
                  style={{...styles.button, ...styles.viewBtn}}
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </button>
                {order.status === 'pending' && (
                  <>
                    <button
                      style={{...styles.button, ...styles.completeBtn}}
                      onClick={() => handleStatusChange(order.id, 'completed')}
                    >
                      Complete
                    </button>
                    <button
                      style={{...styles.button, ...styles.cancelBtn}}
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  style={{...styles.button, ...styles.deleteBtn}}
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={styles.modalTitle}>Order Details</h2>
              
              <div style={styles.modalContent}>
                <div style={styles.modalRow}>
                  <span style={styles.modalLabel}>Order ID:</span>
                  <span style={styles.modalValue}>#{selectedOrder.orderId}</span>
                </div>
                <div style={styles.modalRow}>
                  <span style={styles.modalLabel}>Customer:</span>
                  <span style={styles.modalValue}>{selectedOrder.customerName}</span>
                </div>
                <div style={styles.modalRow}>
                  <span style={styles.modalLabel}>Phone:</span>
                  <span style={styles.modalValue}>+91 {selectedOrder.customerPhone}</span>
                </div>
                <div style={styles.modalRow}>
                  <span style={styles.modalLabel}>Date:</span>
                  <span style={styles.modalValue}>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div style={styles.modalRow}>
                  <span style={styles.modalLabel}>Status:</span>
                  <span style={{...styles.modalValue, color: getStatusColor(selectedOrder.status)}}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div style={styles.modalRow}>
                  <span style={styles.modalLabel}>Payment:</span>
                  <span style={styles.modalValue}>{selectedOrder.paymentMethod || 'COD'}</span>
                </div>
                
                <div style={styles.modalItems}>
                  <div style={{ color: '#808080', marginBottom: '8px' }}>Items:</div>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '11px'
                    }}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div style={{ 
                    marginTop: '8px', 
                    paddingTop: '8px', 
                    borderTop: '1px solid #2a2a2a',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '600'
                  }}>
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <div style={{ color: '#808080', marginBottom: '4px' }}>Delivery Address:</div>
                  <div style={{ fontSize: '11px', color: '#b0b0b0' }}>{selectedOrder.address}</div>
                </div>
              </div>

              <button
                style={styles.modalCloseBtn}
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;