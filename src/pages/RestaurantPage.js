import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { orderService } from '../services/orderService';

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const found = restaurants.find(r => r.id === id);
    setRestaurant(found);

    // Highlight item if coming from search
    if (location.state?.highlightItem) {
      setTimeout(() => {
        const element = document.getElementById(`item-${location.state.highlightItem}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.style.border = '2px solid #D4AF37';
          setTimeout(() => element.style.border = '1px solid #333', 2000);
        }
      }, 500);
    }
  }, [id, location]);

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
    toast.success(`${item.name} added to cart`, {
      icon: '🛒',
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #D4AF37',
      },
    });
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    setShowDetailsModal(true);
  };

  const placeOrder = async () => {
    if (!customerName || !customerPhone || !address) {
      toast.error('Please fill all details');
      return;
    }

    if (customerPhone.length !== 10) {
      toast.error('Enter valid 10-digit phone number');
      return;
    }

    const orderData = {
      orderId: `YFC${Date.now().toString().slice(-8)}`,
      customerName,
      customerPhone,
      address,
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: 1,
        total: item.price
      })),
      total: getTotal(),
      paymentMethod: 'COD',
      restaurantId: restaurant.id,
      restaurantName: restaurant.name
    };

    try {
      const result = await orderService.addOrder(orderData);
      if (result.success) {
        toast.success(
          <div>
            <strong>✅ Order Placed!</strong>
            <p style={{ fontSize: '12px' }}>Order ID: {orderData.orderId}</p>
          </div>
        );
        setCart([]);
        setShowCart(false);
        setShowDetailsModal(false);
        setShowCheckoutModal(false);
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  const categories = ['all', ...new Set(restaurant?.menu.map(item => item.category) || [])];
  const filteredItems = restaurant?.menu.filter(item => 
    selectedCategory === 'all' ? true : item.category === selectedCategory
  ) || [];

  const styles = {
    container: {
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      color: '#ffffff',
    },
    header: {
      background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1600")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '40px 20px',
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.5)',
      border: '2px solid #D4AF37',
      color: '#D4AF37',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 10,
    },
    cartIcon: {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      background: '#D4AF37',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 5px 20px rgba(212,175,55,0.3)',
      zIndex: 100,
    },
    cartCount: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: '#ff4444',
      color: 'white',
      borderRadius: '50%',
      width: '25px',
      height: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
    },
    // ... rest of your existing styles
    restaurantInfo: {
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
    },
    restaurantName: {
      fontSize: '3rem',
      color: '#D4AF37',
      marginBottom: '10px',
    },
    categoryTabs: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      padding: '20px',
      borderBottom: '1px solid #333',
      flexWrap: 'wrap',
    },
    categoryTab: {
      padding: '8px 20px',
      background: 'transparent',
      border: '2px solid #333',
      borderRadius: '30px',
      color: '#888',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    activeCategory: {
      borderColor: '#D4AF37',
      color: '#D4AF37',
    },
    menuContainer: {
      maxWidth: '800px',
      margin: '40px auto',
      padding: '0 20px',
    },
    menuItem: {
      background: '#1a1a1a',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '15px',
      display: 'flex',
      gap: '20px',
      border: '1px solid #333',
      transition: 'all 0.3s',
    },
    itemImage: {
      width: '100px',
      height: '100px',
      borderRadius: '10px',
      objectFit: 'cover',
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: '1.2rem',
      color: '#fff',
      marginBottom: '5px',
    },
    itemPrice: {
      color: '#D4AF37',
      fontSize: '1.3rem',
      fontWeight: 'bold',
    },
    addButton: {
      background: 'transparent',
      border: '2px solid #D4AF37',
      color: '#D4AF37',
      padding: '8px 20px',
      borderRadius: '25px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
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
      zIndex: 1000,
    },
    modal: {
      background: '#1a1a1a',
      border: '2px solid #D4AF37',
      borderRadius: '10px',
      padding: '30px',
      width: '90%',
      maxWidth: '400px',
    },
    modalTitle: {
      color: '#D4AF37',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      background: '#2a2a2a',
      border: '1px solid #333',
      borderRadius: '5px',
      color: '#fff',
    },
    modalButtons: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    cancelBtn: {
      flex: 1,
      padding: '10px',
      background: 'transparent',
      border: '1px solid #666',
      color: '#fff',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    confirmBtn: {
      flex: 2,
      padding: '10px',
      background: '#D4AF37',
      border: 'none',
      color: '#1a1a1a',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  };

  if (!restaurant) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <div style={styles.backButton} onClick={() => navigate('/')}>
        <ArrowBackIcon />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.restaurantInfo}>
          <h1 style={styles.restaurantName}>{restaurant.name}</h1>
          <p>{restaurant.cuisine}</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category}
            style={{
              ...styles.categoryTab,
              ...(selectedCategory === category ? styles.activeCategory : {})
            }}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'All' : category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div style={styles.menuContainer}>
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            id={`item-${item.id}`}
            style={styles.menuItem}
            whileHover={{ y: -2, borderColor: '#D4AF37' }}
          >
            <img src={item.image} alt={item.name} style={styles.itemImage} />
            <div style={styles.itemInfo}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>{item.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span style={styles.itemPrice}>₹{item.price}</span>
                <button 
                  style={styles.addButton}
                  onClick={() => addToCart(item)}
                >
                  <AddIcon /> ADD
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Icon */}
      {cart.length > 0 && (
        <div style={styles.cartIcon} onClick={() => setShowCart(!showCart)}>
          <ShoppingCartIcon style={{ color: '#1a1a1a', fontSize: '30px' }} />
          <span style={styles.cartCount}>{cart.length}</span>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100vh',
          background: '#1a1a1a',
          borderLeft: '2px solid #D4AF37',
          padding: '20px',
          zIndex: 1000,
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3>Your Cart ({cart.length})</h3>
            <CloseIcon style={{ color: '#D4AF37', cursor: 'pointer' }} onClick={() => setShowCart(false)} />
          </div>
          
          {cart.map((item) => (
            <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', background: '#2a2a2a', borderRadius: '5px' }}>
              <div>
                <div>{item.name}</div>
                <div style={{ color: '#D4AF37' }}>₹{item.price}</div>
              </div>
              <RemoveIcon style={{ color: '#ff4444', cursor: 'pointer' }} onClick={() => removeFromCart(item.cartId)} />
            </div>
          ))}
          
          <div style={{ marginTop: '20px', padding: '10px', borderTop: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
              <span>Total:</span>
              <span style={{ color: '#D4AF37' }}>₹{getTotal()}</span>
            </div>
            <button 
              onClick={proceedToCheckout}
              style={{
                width: '100%',
                padding: '15px',
                background: '#D4AF37',
                border: 'none',
                borderRadius: '5px',
                marginTop: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showDetailsModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Enter Your Details</h3>
            
            <input
              type="text"
              placeholder="Full Name *"
              style={styles.input}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            
            <input
              type="tel"
              placeholder="Phone Number (10 digits) *"
              style={styles.input}
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength="10"
            />
            
            <textarea
              placeholder="Delivery Address *"
              style={{ ...styles.input, minHeight: '80px' }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowDetailsModal(false)}>
                Cancel
              </button>
              <button style={styles.confirmBtn} onClick={placeOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantPage;