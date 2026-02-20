// pages/HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import { addOrder } from '../db/database';
import { orderService } from '../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import ReceiptImage from '../components/ReceiptImage';
import OrderTracking from '../components/OrderTracking';

function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [location, setLocation] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [showAddressReminder, setShowAddressReminder] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  const receiptRef = useRef(null);

  // Product images
  const productImages = {
    '✨ SPECIAL CREAMY COFFEE': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500',
    'NORMAL COFFEE': 'https://images.unsplash.com/photo-1544787219-6f284715c5c7?w=500',
    'COLD COFFEE': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500',
    'EGG ROLL': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500',
    'VEG ROLL': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500',
    'PASTREE': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500',
    'BIRTHDAY CAKE (1/2 KG)': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    'DAIRY MILK': 'https://m.media-amazon.com/images/I/61GmTQ6mykL.jpg',
    'RASGULLA (PER PIECE)': 'https://img.freepik.com/premium-photo/indian-sweet-rasgulla-famous-bengali-sweet-clay-bowl-with-napkin_136354-228.jpg',
    'BISCUITS - SMALL PACK': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
    'BISCUITS - FAMILY PACK': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
    'VEG MOMOS': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500',
    'NON-VEG MOMOS': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=500',
    'SANDWICH + JUICE COMBO': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500',
  };

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500';

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('menuItems')) || [];
    const itemsWithImages = items.map(item => ({
      ...item,
      image: productImages[item.name] || FALLBACK_IMAGE
    }));
    setMenuItems(itemsWithImages);

    // Load saved customer details if any
    const savedName = localStorage.getItem('customerName');
    const savedPhone = localStorage.getItem('customerPhone');
    const savedAddress = localStorage.getItem('customerAddress');
    
    if (savedName) setCustomerName(savedName);
    if (savedPhone) setCustomerPhone(savedPhone);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  // Validate customer details
  const validateCustomerDetails = () => {
    if (!customerName.trim()) {
      setDetailsError('Please enter your name');
      return false;
    }
    if (!customerPhone.trim()) {
      setDetailsError('Please enter your phone number');
      return false;
    }
    if (customerPhone.length !== 10 || !/^\d+$/.test(customerPhone)) {
      setDetailsError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!address.trim() && !location) {
      setDetailsError('Please enter your delivery address');
      return false;
    }
    setDetailsError('');
    return true;
  };

  // Add to cart
  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
    setLastAddedItem(item);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2000);
    
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        style={styles.customToast}
      >
        <CheckCircleIcon style={{ color: '#D4AF37', marginRight: '10px' }} />
        <div>
          <strong>{item.name}</strong>
          <p style={{ fontSize: '12px', margin: 0 }}>Added to cart! ₹{item.price}</p>
        </div>
      </motion.div>
    ), {
      duration: 2000,
      position: 'bottom-center',
    });
  };

  // Remove from cart
  const removeFromCart = (cartId, itemName) => {
    setCart(cart.filter(item => item.cartId !== cartId));
    toast(`${itemName} removed`, {
      icon: '🗑️',
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #D4AF37',
      },
    });
  };

  // Calculate total
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!', {
        icon: '🛒',
        style: toastErrorStyle,
      });
      return;
    }
    
    if (!validateCustomerDetails()) {
      setShowLocationModal(true);
      return;
    }
    
    setShowCheckoutConfirm(true);
  };

  // Save customer details to localStorage
  const saveCustomerDetails = () => {
    if (customerName) localStorage.setItem('customerName', customerName);
    if (customerPhone) localStorage.setItem('customerPhone', customerPhone);
    if (address) localStorage.setItem('customerAddress', address);
  };

  // Send order to database
  const sendWhatsAppOrder = async () => {
    if (!validateCustomerDetails()) {
      setShowLocationModal(true);
      setShowCheckoutConfirm(false);
      return;
    }

    const deliveryAddress = address || location || 'Not provided';
    
    // Save details
    saveCustomerDetails();

    // Group items
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

    const itemsArray = Object.entries(itemSummary).map(([name, data]) => ({
      name,
      price: data.price,
      quantity: data.quantity,
      total: data.total
    }));

    const orderId = `YFC${Date.now().toString().slice(-8)}`;

    try {
      toast.loading('Placing your order...', { id: 'order' });

      // Save to SQLite database via API
      const orderData = {
        orderId,
        customerName,
        customerPhone,
        address: deliveryAddress,
        items: itemsArray,
        total: getTotal(),
        paymentMethod,
      };

      const result = await orderService.addOrder(orderData);

      if (result.success) {
        toast.success(
          <div>
            <strong>✅ Order Placed Successfully!</strong>
            <p style={{ fontSize: '12px', margin: '5px 0 0 0', color: '#D4AF37' }}>
              Order ID: #{orderId}
            </p>
          </div>,
          { id: 'order', duration: 5000 }
        );

        setCart([]);
        setShowCart(false);
        setShowCheckoutConfirm(false);
      }

    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.', { id: 'order' });
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    toast.loading('Getting your precise location...', { id: 'location' });
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Lat: ${latitude}, Long: ${longitude}`;
          const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          
          setLocation(locationString);
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
              if (data.display_name) {
                setAddress(data.display_name);
              }
            })
            .catch(err => console.log('Could not fetch address name'));
          
          setShowLocationModal(false);
          toast.success(
            <div>
              <strong>Location captured!</strong>
              <p style={{ fontSize: '12px', margin: '5px 0 0 0' }}>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#D4AF37' }}>
                  View on Google Maps
                </a>
              </p>
            </div>,
            { id: 'location', duration: 5000 }
          );
          setShowAddressReminder(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Please enter your address manually', { id: 'location' });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation not supported', { id: 'location' });
    }
  };

  const categories = [
    { id: 'coffee', name: '☕ COFFEE', icon: '✨' },
    { id: 'rolls', name: '🌯 ROLLS', icon: '🥚' },
    { id: 'bakery', name: '🎂 BAKERY', icon: '🧁' },
    { id: 'sweets', name: '🍬 SWEETS', icon: '🍭' },
    { id: 'snacks', name: '🍪 SNACKS', icon: '🍫' },
    { id: 'momos', name: '🥟 MOMOS', icon: '🥟' },
    { id: 'combo', name: '🍽️ COMBOS', icon: '🥪' },
  ];

  const toastErrorStyle = {
    background: '#1a1a1a',
    color: '#fff',
    border: '1px solid #ff4444',
  };

  return (
    <div style={styles.container}>
      {/* Hidden Receipt Component for Image Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <ReceiptImage
          ref={receiptRef}
          customerName={customerName}
          customerPhone={customerPhone}
          address={address || location}
          cart={cart}
          getTotal={getTotal}
          paymentMethod={paymentMethod}
          mapsLink={location && location.includes('Lat:') ? 
            `https://www.google.com/maps?q=${location.match(/Lat: ([\d.-]+)/)?.[1]},${location.match(/Long: ([\d.-]+)/)?.[1]}` : 
            ''}
          orderId={`YFC${Date.now().toString().slice(-8)}`}
          orderDate={new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
          orderTime={new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
          deliveryTime={new Date(new Date().getTime() + 40 * 60000).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={styles.header}
      >
        <div style={styles.headerOverlay}></div>
        <div style={styles.headerContent}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 style={styles.shopName}>YFC</h1>
          </motion.div>
          <p style={styles.tagline}>YOUR FAVOURITE COFFEE</p>
          <div style={styles.goldDivider}></div>
          <p style={styles.description}>
            Premium coffee & snacks delivered in 30 mins
          </p>
          
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <LocalCafeIcon style={styles.statIcon} />
              <span>Signature Coffee @ ₹50</span>
            </div>
            <div style={styles.statItem}>
              <DeliveryDiningIcon style={styles.statIcon} />
              <span>Free Delivery</span>
            </div>
          </div>

          {/* Track Order Button - Moved INSIDE headerContent */}
          <motion.button
            style={styles.trackButton}
            onClick={() => setShowTracking(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍 Track Your Order
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Action Buttons */}
      <motion.div 
        style={styles.floatingActions}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        {/* Cart Button */}
        <motion.div 
          style={styles.cartButton}
          onClick={() => setShowCart(!showCart)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingCartIcon style={styles.cartIconSvg} />
          {cart.length > 0 && (
            <motion.span 
              style={styles.cartCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={cart.length}
            >
              {cart.length}
            </motion.span>
          )}
        </motion.div>

        {/* Address Button if not set */}
        {(!address || !customerName || !customerPhone) && (
          <motion.div 
            style={styles.addressReminderButton}
            onClick={() => setShowLocationModal(true)}
            whileHover={{ scale: 1.1 }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PersonIcon />
            <span>Add Details</span>
          </motion.div>
        )}
      </motion.div>

      {/* Address Reminder Popup */}
      <AnimatePresence>
        {showAddressReminder && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={styles.reminderPopup}
          >
            <InfoIcon style={{ color: '#D4AF37', marginRight: '10px' }} />
            <span>Please add your details first!</span>
            <button 
              style={styles.reminderButton}
              onClick={() => setShowLocationModal(true)}
            >
              Add Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && lastAddedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={styles.successPopup}
          >
            <CheckCircleIcon style={{ color: '#D4AF37', fontSize: '40px' }} />
            <h3>Added to Cart!</h3>
            <p>{lastAddedItem.name}</p>
            <p style={styles.successPrice}>₹{lastAddedItem.price}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            style={styles.cartSidebar}
          >
            <div style={styles.cartHeader}>
              <h3 style={styles.cartTitle}>
                <ShoppingCartIcon style={{ marginRight: '10px' }} />
                YOUR CART ({cart.length})
              </h3>
              <CloseIcon 
                style={styles.closeCart} 
                onClick={() => setShowCart(false)}
              />
            </div>
            
            <div style={styles.cartItems}>
              {cart.length === 0 ? (
                <div style={styles.emptyCart}>
                  <RestaurantMenuIcon style={{ fontSize: '50px', color: '#333', marginBottom: '20px' }} />
                  <p>Your cart is empty</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>Add items from the menu</p>
                  <button 
                    style={styles.browseMenuBtn}
                    onClick={() => setShowCart(false)}
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div 
                    key={item.cartId}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    style={styles.cartItem}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={styles.cartItemImage}
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div style={styles.cartItemInfo}>
                      <p style={styles.cartItemName}>{item.name}</p>
                      <p style={styles.cartItemPrice}>₹{item.price}</p>
                    </div>
                    <RemoveIcon 
                      style={styles.removeItem}
                      onClick={() => removeFromCart(item.cartId, item.name)}
                    />
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div style={styles.cartSummary}>
                  <div style={styles.cartTotal}>
                    <span>Subtotal:</span>
                    <span>₹{getTotal()}</span>
                  </div>
                  <div style={styles.cartTotal}>
                    <span>Delivery:</span>
                    <span style={{ color: '#D4AF37' }}>FREE</span>
                  </div>
                  <div style={styles.cartGrandTotal}>
                    <span>Total:</span>
                    <span style={styles.totalAmount}>₹{getTotal()}</span>
                  </div>
                </div>

                {/* Customer Details Status */}
                <div style={styles.addressStatus}>
                  <PersonIcon style={{ color: customerName ? '#D4AF37' : '#ff4444' }} />
                  <span style={{ color: customerName ? '#fff' : '#ff4444', fontSize: '14px' }}>
                    {customerName ? `Hi, ${customerName}` : 'Name required'}
                  </span>
                </div>

                <div style={styles.addressStatus}>
                  <PhoneIcon style={{ color: customerPhone ? '#D4AF37' : '#ff4444' }} />
                  <span style={{ color: customerPhone ? '#fff' : '#ff4444', fontSize: '14px' }}>
                    {customerPhone ? `+91 ${customerPhone}` : 'Phone required'}
                  </span>
                </div>

                <div style={styles.addressStatus}>
                  <LocationOnIcon style={{ color: address || location ? '#D4AF37' : '#ff4444' }} />
                  <span style={{ color: address || location ? '#fff' : '#ff4444', fontSize: '14px' }}>
                    {address || location ? 'Address added ✓' : 'Address required'}
                  </span>
                  <button 
                    style={styles.changeAddressBtn}
                    onClick={() => setShowLocationModal(true)}
                  >
                    {address || location ? 'Change' : 'Add'}
                  </button>
                </div>

                <button 
                  style={styles.checkoutBtn}
                  onClick={proceedToCheckout}
                  disabled={isGeneratingReceipt}
                >
                  {isGeneratingReceipt ? 'PROCESSING...' : 'PROCEED TO CHECKOUT'}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {showCheckoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setShowCheckoutConfirm(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={styles.confirmModal}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={styles.confirmTitle}>Confirm Order</h3>
              
              <div style={styles.confirmDetails}>
                <p><strong>👤 Name:</strong> {customerName}</p>
                <p><strong>📱 Phone:</strong> +91 {customerPhone}</p>
                <p><strong>📍 Address:</strong> {address || location}</p>
                <p><strong>🛒 Items:</strong> {cart.length}</p>
                <p><strong>💰 Total:</strong> ₹{getTotal()}</p>
                <p><strong>💵 Payment:</strong> {paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</p>
                <p><strong>⏱️ Delivery by:</strong> {new Date(new Date().getTime() + 40 * 60000).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}</p>
              </div>

              <div style={styles.confirmActions}>
                <button 
                  style={styles.confirmCancel}
                  onClick={() => setShowCheckoutConfirm(false)}
                  disabled={isGeneratingReceipt}
                >
                  Cancel
                </button>
                <button 
                  style={styles.confirmSend}
                  onClick={sendWhatsAppOrder}
                  disabled={isGeneratingReceipt}
                >
                  <WhatsAppIcon /> {isGeneratingReceipt ? 'GENERATING...' : 'CONFIRM & SEND'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Details & Address Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              style={styles.modal}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={styles.modalTitle}>📋 Your Details</h3>
              <p style={styles.modalSubtext}>Please fill all fields to continue</p>
              
              {detailsError && (
                <div style={styles.errorMessage}>
                  <ErrorIcon style={{ marginRight: '5px', fontSize: '18px' }} />
                  {detailsError}
                </div>
              )}
              
              {/* Customer Name */}
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>
                  <PersonIcon style={styles.inputIcon} /> Full Name *
                </label>
                <input
                  type="text"
                  style={styles.modalInput}
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    setDetailsError('');
                  }}
                />
              </div>

              {/* Customer Phone */}
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>
                  <PhoneIcon style={styles.inputIcon} /> Phone Number *
                </label>
                <input
                  type="tel"
                  style={styles.modalInput}
                  placeholder="10-digit mobile number"
                  value={customerPhone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setCustomerPhone(value);
                    setDetailsError('');
                  }}
                  maxLength="10"
                />
                {customerPhone && customerPhone.length < 10 && (
                  <small style={{ color: '#ffaa00', marginTop: '5px', display: 'block' }}>
                    Please enter 10 digits
                  </small>
                )}
              </div>
              
              {/* Location Button */}
              <button 
                style={styles.locationBtnModal}
                onClick={getCurrentLocation}
              >
                <LocationOnIcon /> Use My Current Location
              </button>
              
              <div style={styles.divider}>
                <span>OR</span>
              </div>
              
              {/* Address Textarea */}
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>
                  <LocationOnIcon style={styles.inputIcon} /> Delivery Address *
                </label>
                <textarea
                  style={styles.addressInput}
                  placeholder="Enter your full address with landmark..."
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setDetailsError('');
                  }}
                  rows="3"
                />
              </div>
              
              <div style={styles.modalButtons}>
                <button 
                  style={styles.modalCancel}
                  onClick={() => setShowLocationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={styles.modalSave}
                  onClick={() => {
                    if (validateCustomerDetails()) {
                      setShowLocationModal(false);
                      setShowAddressReminder(false);
                      saveCustomerDetails();
                      toast.success('Details saved successfully!', {
                        icon: '✅',
                      });
                    }
                  }}
                >
                  Save Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Tracking Modal */}
      <AnimatePresence>
        {showTracking && (
          <OrderTracking 
            onClose={() => setShowTracking(false)} 
          />
        )}
      </AnimatePresence>

      {/* Menu Grid */}
      <div style={styles.menuContainer}>
        {categories.map((category, idx) => {
          const categoryItems = menuItems.filter(item => item.category === category.id);
          if (categoryItems.length === 0) return null;

          return (
            <motion.div 
              key={category.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              style={styles.categorySection}
            >
              <h2 style={styles.categoryTitle}>
                {category.icon} {category.name}
              </h2>
              <div style={styles.menuGrid}>
                {categoryItems.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ y: -5 }}
                    style={{
                      ...styles.menuCard,
                      ...(item.popular ? styles.popularCard : {})
                    }}
                  >
                    {item.popular && (
                      <span style={styles.popularBadge}>🔥 POPULAR</span>
                    )}
                    
                    <div style={styles.imageContainer}>
                      <img 
                        src={productImages[item.name] || FALLBACK_IMAGE}
                        alt={item.name}
                        style={styles.productImage}
                        onError={(e) => {
                          console.log(`Image failed to load for: ${item.name}`);
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    
                    <div style={styles.menuContent}>
                      <h3 style={styles.menuItemName}>{item.name}</h3>
                      {item.description && (
                        <p style={styles.menuItemDesc}>{item.description}</p>
                      )}
                      <div style={styles.menuItemFooter}>
                        <span style={styles.menuItemPrice}>₹{item.price}</span>
                        <motion.button 
                          style={styles.addToCartBtn}
                          onClick={() => addToCart(item)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <AddIcon /> ADD
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Shop Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={styles.infoSection}
      >
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <LocationOnIcon style={styles.infoIcon} />
            <h3>📍 Visit Us</h3>
            <p>Jaleswar, Balasore</p>
            <p>Open: 7 AM - 10 PM</p>
          </div>
          <div style={styles.infoCard}>
            <WhatsAppIcon style={styles.infoIcon} />
            <h3>📱 WhatsApp</h3>
            <p>+91 7996523698</p>
            <p>Click & Order</p>
          </div>
          <div style={styles.infoCard}>
            <DeliveryDiningIcon style={styles.infoIcon} />
            <h3>🚚 Delivery</h3>
            <p>FREE in Jaleswar</p>
            <p>30 mins max</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    backgroundColor: '#0a0a0a',
    minHeight: '100vh',
    color: '#ffffff',
    position: 'relative',
  },
  header: {
    height: '70vh',
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1600")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, #0a0a0a 80%)',
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    padding: '0 20px',
  },
  shopName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '6rem',
    fontWeight: 700,
    color: '#D4AF37',
    marginBottom: '0.5rem',
    letterSpacing: '8px',
    textShadow: '0 0 30px rgba(212,175,55,0.5)',
  },
  tagline: {
    fontSize: '1.2rem',
    letterSpacing: '8px',
    color: '#888',
    marginBottom: '2rem',
  },
  goldDivider: {
    width: '150px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
    margin: '2rem auto',
  },
  description: {
    fontSize: '1.2rem',
    color: '#ccc',
    marginBottom: '2rem',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    marginTop: '2rem',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#D4AF37',
    fontSize: '1rem',
    background: 'rgba(26,26,26,0.8)',
    padding: '10px 20px',
    borderRadius: '30px',
    border: '1px solid #D4AF37',
  },
  statIcon: {
    fontSize: '1.5rem',
  },
  trackButton: {
    background: 'transparent',
    border: '2px solid #D4AF37',
    color: '#D4AF37',
    padding: '12px 30px',
    borderRadius: '40px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'all 0.3s',
  },
  floatingActions: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    zIndex: 999,
  },
  cartButton: {
    background: '#1a1a1a',
    border: '2px solid #D4AF37',
    borderRadius: '50%',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 5px 20px rgba(212,175,55,0.3)',
    position: 'relative',
  },
  cartIconSvg: {
    color: '#D4AF37',
    fontSize: '35px',
  },
  cartCount: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#D4AF37',
    color: '#1a1a1a',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  addressReminderButton: {
    background: '#D4AF37',
    color: '#1a1a1a',
    padding: '12px 20px',
    borderRadius: '40px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 5px 20px rgba(212,175,55,0.5)',
  },
  reminderPopup: {
    position: 'fixed',
    bottom: '120px',
    right: '30px',
    background: '#1a1a1a',
    border: '2px solid #D4AF37',
    borderRadius: '10px',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 1000,
    boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
  },
  reminderButton: {
    background: '#D4AF37',
    color: '#1a1a1a',
    border: 'none',
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  successPopup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#1a1a1a',
    border: '3px solid #D4AF37',
    borderRadius: '20px',
    padding: '30px',
    textAlign: 'center',
    zIndex: 2000,
    boxShadow: '0 10px 40px rgba(212,175,55,0.3)',
  },
  successPrice: {
    color: '#D4AF37',
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  cartSidebar: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '450px',
    height: '100vh',
    background: '#1a1a1a',
    borderLeft: '2px solid #D4AF37',
    zIndex: 1001,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-5px 0 30px rgba(0,0,0,0.5)',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '2px solid #333',
  },
  cartTitle: {
    color: '#D4AF37',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  closeCart: {
    color: '#D4AF37',
    cursor: 'pointer',
    fontSize: '24px',
  },
  cartItems: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '10px',
    background: '#2a2a2a',
    borderRadius: '10px',
    gap: '15px',
  },
  cartItemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: '1rem',
    color: '#fff',
    marginBottom: '5px',
    fontWeight: 500,
  },
  cartItemPrice: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  removeItem: {
    color: '#ff4444',
    cursor: 'pointer',
    fontSize: '20px',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '50px 20px',
    color: '#666',
  },
  browseMenuBtn: {
    background: 'transparent',
    border: '2px solid #D4AF37',
    color: '#D4AF37',
    padding: '10px 30px',
    borderRadius: '5px',
    marginTop: '20px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  cartSummary: {
    background: '#2a2a2a',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  cartTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    color: '#ccc',
  },
  cartGrandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '2px solid #333',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#D4AF37',
    fontSize: '1.3rem',
  },
  addressStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#2a2a2a',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  changeAddressBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: '1px solid #D4AF37',
    color: '#D4AF37',
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  checkoutBtn: {
    background: 'linear-gradient(135deg, #D4AF37 0%, #996515 100%)',
    color: '#1a1a1a',
    border: 'none',
    padding: '18px',
    borderRadius: '10px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  menuContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  categorySection: {
    marginBottom: '4rem',
  },
  categoryTitle: {
    color: '#D4AF37',
    fontSize: '2.5rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #333',
    paddingBottom: '1rem',
  },
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  menuCard: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '15px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  popularCard: {
    border: '2px solid #D4AF37',
    boxShadow: '0 0 30px rgba(212,175,55,0.2)',
  },
  popularBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#D4AF37',
    color: '#1a1a1a',
    padding: '5px 15px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    borderRadius: '20px',
    zIndex: 2,
  },
  imageContainer: {
    height: '220px',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  menuContent: {
    padding: '1.5rem',
  },
  menuItemName: {
    fontSize: '1.3rem',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  menuItemDesc: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '1rem',
  },
  menuItemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: '1.8rem',
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  addToCartBtn: {
    background: 'transparent',
    border: '2px solid #D4AF37',
    color: '#D4AF37',
    padding: '8px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: 'bold',
    transition: 'all 0.3s',
  },
  infoSection: {
    background: '#1a1a1a',
    padding: '4rem 2rem',
    borderTop: '2px solid #D4AF37',
  },
  infoGrid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
  },
  infoCard: {
    textAlign: 'center',
    padding: '2rem',
  },
  infoIcon: {
    fontSize: '3rem',
    color: '#D4AF37',
    marginBottom: '1rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    background: '#1a1a1a',
    border: '2px solid #D4AF37',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '90%',
    maxWidth: '500px',
  },
  modalTitle: {
    color: '#D4AF37',
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  modalSubtext: {
    color: '#888',
    marginBottom: '2rem',
  },
  locationBtnModal: {
    width: '100%',
    padding: '15px',
    background: '#2a2a2a',
    border: '2px solid #D4AF37',
    color: '#fff',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontSize: '1rem',
    marginBottom: '20px',
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    color: '#666',
    position: 'relative',
  },
  addressInput: {
    width: '100%',
    padding: '15px',
    background: '#2a2a2a',
    border: '2px solid #333',
    color: '#fff',
    borderRadius: '10px',
    marginBottom: '20px',
    fontFamily: 'inherit',
    fontSize: '1rem',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  modalCancel: {
    padding: '12px 25px',
    background: 'transparent',
    border: '2px solid #666',
    color: '#fff',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  modalSave: {
    padding: '12px 25px',
    background: '#D4AF37',
    border: 'none',
    color: '#1a1a1a',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  confirmModal: {
    background: '#1a1a1a',
    border: '3px solid #D4AF37',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '90%',
    maxWidth: '450px',
  },
  confirmTitle: {
    color: '#D4AF37',
    fontSize: '2rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  confirmDetails: {
    background: '#2a2a2a',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '2rem',
    lineHeight: '2',
  },
  confirmActions: {
    display: 'flex',
    gap: '1rem',
  },
  confirmCancel: {
    flex: 1,
    padding: '15px',
    background: 'transparent',
    border: '2px solid #666',
    color: '#fff',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  confirmSend: {
    flex: 2,
    padding: '15px',
    background: '#25D366',
    border: 'none',
    color: '#fff',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  inputGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  inputLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#D4AF37',
    marginBottom: '8px',
    fontSize: '0.95rem',
  },
  inputIcon: {
    fontSize: '18px',
    color: '#D4AF37',
  },
  modalInput: {
    width: '100%',
    padding: '12px 15px',
    background: '#2a2a2a',
    border: '2px solid #333',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s',
  },
  errorMessage: {
    background: 'rgba(255, 68, 68, 0.1)',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  customToast: {
    background: '#1a1a1a',
    border: '2px solid #D4AF37',
    borderRadius: '10px',
    padding: '15px 25px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(212,175,55,0.2)',
  },
};

export default HomePage;