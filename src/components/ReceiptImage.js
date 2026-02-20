// components/ReceiptImage.js
import React, { forwardRef } from 'react';

const ReceiptImage = forwardRef(({ 
  orderData, 
  customerName, 
  customerPhone, 
  address, 
  cart, 
  getTotal,
  paymentMethod,
  mapsLink,
  orderId,
  orderDate,
  orderTime,
  deliveryTime
}, ref) => {
  
  const itemSummary = {};
  cart.forEach(item => {
    if (itemSummary[item.name]) {
      itemSummary[item.name].quantity += 1;
      itemSummary[item.name].total += item.price;
    } else {
      itemSummary[item.name] = {
        price: item.price,
        quantity: 1,
        total: item.price
      };
    }
  });

  return (
    <div ref={ref} style={styles.receiptContainer}>
      {/* Premium Header with Gold Border */}
      <div style={styles.headerBorder}>
        <div style={styles.header}>
          <h1 style={styles.shopName}>YFC</h1>
          <p style={styles.tagline}>YOUR FAVOURITE COFFEE</p>
          <p style={styles.shopAddress}>Jaleswar, Balasore | +91 7996523698</p>
        </div>
      </div>

      {/* Watermark for Security */}
      <div style={styles.watermark}>ORIGINAL RECEIPT</div>

      {/* Order Reference */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span style={styles.titleIcon}>📋</span> ORDER REFERENCE
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Order ID:</span>
          <span style={styles.value}>{orderId}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Date:</span>
          <span style={styles.value}>{orderDate}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Time:</span>
          <span style={styles.value}>{orderTime}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Delivery by:</span>
          <span style={styles.valueHighlight}>{deliveryTime}</span>
        </div>
      </div>

      {/* Customer Details */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span style={styles.titleIcon}>👤</span> CUSTOMER DETAILS
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Name:</span>
          <span style={styles.value}>{customerName}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Phone:</span>
          <span style={styles.value}>+91 {customerPhone}</span>
        </div>
      </div>

      {/* Items Purchased */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span style={styles.titleIcon}>🛒</span> ITEMS PURCHASED
        </div>
        <div style={styles.itemsHeader}>
          <span style={styles.itemNameHeader}>Item</span>
          <span style={styles.itemQtyHeader}>Qty</span>
          <span style={styles.itemPriceHeader}>Price</span>
          <span style={styles.itemTotalHeader}>Total</span>
        </div>
        <div style={styles.itemsList}>
          {Object.entries(itemSummary).map(([name, data], index) => (
            <div key={index} style={styles.itemRow}>
              <span style={styles.itemName}>{name}</span>
              <span style={styles.itemQty}>{data.quantity}</span>
              <span style={styles.itemPrice}>₹{data.price}</span>
              <span style={styles.itemTotal}>₹{data.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bill Summary */}
      <div style={styles.summarySection}>
        <div style={styles.summaryRow}>
          <span>Subtotal:</span>
          <span>₹{getTotal()}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Delivery Charges:</span>
          <span style={styles.freeText}>FREE</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Packaging:</span>
          <span>₹0</span>
        </div>
        <div style={styles.totalRow}>
          <span>TOTAL AMOUNT:</span>
          <span style={styles.totalAmount}>₹{getTotal()}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span style={styles.titleIcon}>💳</span> PAYMENT DETAILS
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Method:</span>
          <span style={styles.value}>{paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.label}>Status:</span>
          <span style={styles.pendingStatus}>PENDING</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span style={styles.titleIcon}>📍</span> DELIVERY ADDRESS
        </div>
        <div style={styles.addressBox}>
          <p style={styles.addressText}>{address}</p>
          {mapsLink && (
            <p style={styles.mapsLink}>📍 Live Location: {mapsLink}</p>
          )}
        </div>
      </div>

      {/* Special Notes */}
      {cart.some(item => item.name.includes('MOMOS') || item.name.includes('CAKE')) && (
        <div style={styles.specialNotes}>
          <div style={styles.sectionTitle}>
            <span style={styles.titleIcon}>📝</span> SPECIAL NOTES
          </div>
          {cart.some(item => item.name.includes('MOMOS')) && (
            <p style={styles.noteText}>🥟 Momos: Please confirm availability</p>
          )}
          {cart.some(item => item.name.includes('CAKE')) && (
            <p style={styles.noteText}>🎂 Cake: Share flavor & customization via call</p>
          )}
        </div>
      )}

      {/* Footer with QR Code Simulation and Security Features */}
      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <p style={styles.footerText}>Thank you for choosing YFC!</p>
          <p style={styles.footerSmall}>This is a computer generated receipt</p>
        </div>
        <div style={styles.footerRight}>
          <div style={styles.qrPlaceholder}>
            <span style={styles.qrText}>YFC</span>
          </div>
        </div>
      </div>

      {/* Security Hash */}
      <div style={styles.hashFooter}>
        <span style={styles.hashText}>#{orderId}-{customerPhone.slice(-4)}-VERIFIED</span>
      </div>
    </div>
  );
});

const styles = {
  receiptContainer: {
    width: '800px',
    backgroundColor: '#fff8f0',
    padding: '30px',
    fontFamily: "'Courier New', monospace",
    position: 'relative',
    border: '2px solid #D4AF37',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  headerBorder: {
    borderBottom: '3px solid #D4AF37',
    marginBottom: '20px',
  },
  header: {
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    color: '#D4AF37',
    borderRadius: '10px 10px 0 0',
  },
  shopName: {
    fontSize: '48px',
    margin: '0',
    letterSpacing: '5px',
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  tagline: {
    fontSize: '16px',
    margin: '5px 0',
    color: '#fff',
  },
  shopAddress: {
    fontSize: '12px',
    margin: '5px 0',
    color: '#ccc',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: '60px',
    color: 'rgba(212, 175, 55, 0.1)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 1,
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    position: 'relative',
    zIndex: 2,
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: '15px',
    borderBottom: '2px solid #D4AF37',
    paddingBottom: '5px',
  },
  titleIcon: {
    marginRight: '8px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    color: '#333',
  },
  valueHighlight: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  itemsHeader: {
    display: 'flex',
    padding: '10px 0',
    borderBottom: '2px solid #D4AF37',
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  itemNameHeader: {
    flex: 3,
  },
  itemQtyHeader: {
    flex: 1,
    textAlign: 'center',
  },
  itemPriceHeader: {
    flex: 1.5,
    textAlign: 'right',
  },
  itemTotalHeader: {
    flex: 1.5,
    textAlign: 'right',
  },
  itemsList: {
    marginTop: '10px',
  },
  itemRow: {
    display: 'flex',
    padding: '8px 0',
    borderBottom: '1px dashed #e0e0e0',
  },
  itemName: {
    flex: 3,
    fontSize: '14px',
  },
  itemQty: {
    flex: 1,
    textAlign: 'center',
    fontSize: '14px',
  },
  itemPrice: {
    flex: 1.5,
    textAlign: 'right',
    fontSize: '14px',
  },
  itemTotal: {
    flex: 1.5,
    textAlign: 'right',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  summarySection: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
  },
  freeText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '2px solid #D4AF37',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#D4AF37',
    fontSize: '20px',
  },
  pendingStatus: {
    backgroundColor: '#ffaa00',
    color: '#000',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  addressBox: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    borderRadius: '5px',
  },
  addressText: {
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0',
  },
  mapsLink: {
    fontSize: '12px',
    color: '#D4AF37',
    marginTop: '5px',
  },
  specialNotes: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    border: '1px solid #ffaa00',
  },
  noteText: {
    fontSize: '14px',
    margin: '5px 0',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '30px',
    padding: '20px',
    borderTop: '2px solid #D4AF37',
  },
  footerLeft: {
    textAlign: 'left',
  },
  footerText: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#D4AF37',
    margin: '0',
  },
  footerSmall: {
    fontSize: '10px',
    color: '#999',
    margin: '5px 0 0',
  },
  footerRight: {
    textAlign: 'right',
  },
  qrPlaceholder: {
    width: '60px',
    height: '60px',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #D4AF37',
  },
  qrText: {
    color: '#D4AF37',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  hashFooter: {
    textAlign: 'center',
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
  },
  hashText: {
    fontSize: '10px',
    color: '#666',
    fontFamily: 'monospace',
  },
};

export default ReceiptImage;