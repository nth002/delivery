import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import CakeIcon from '@mui/icons-material/Cake';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import OrderTracking from '../components/OrderTracking'; // Import the tracking component

function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [viewMode, setViewMode] = useState('restaurants');
  const [trendingItems, setTrendingItems] = useState([]);
  const [showTracking, setShowTracking] = useState(false); // State for tracking modal
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('restaurants')) || [];
    setRestaurants(data);
    
    // Flatten all food items from all restaurants
    const foodItems = [];
    data.forEach(restaurant => {
      restaurant.menu.forEach(item => {
        foodItems.push({
          ...item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantRating: restaurant.rating
        });
      });
    });
    setAllFoodItems(foodItems);
    
    // Get trending items (popular items)
    const trending = foodItems.filter(item => item.popular).slice(0, 4);
    setTrendingItems(trending);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setViewMode('restaurants');
      return;
    }

    // Search in food items
    const foodResults = allFoodItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (foodResults.length > 0) {
      setSearchResults(foodResults);
      setViewMode('food');
    } else {
      // If no food items found, search restaurants
      const restaurantResults = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(restaurantResults);
      setViewMode('restaurants');
    }
  }, [searchTerm, allFoodItems, restaurants]);

  const cuisines = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'coffee', name: 'Coffee', icon: '☕' },
    { id: 'tea', name: 'Tea', icon: '🫖' },
    { id: 'sweets', name: 'Sweets', icon: '🍬' },
    { id: 'snacks', name: 'Snacks', icon: '🍪' },
    { id: 'rolls', name: 'Rolls', icon: '🌯' },
    { id: 'bakery', name: 'Bakery', icon: '🍰' },
  ];

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'coffee': return <FreeBreakfastIcon />;
      case 'tea': return <EmojiFoodBeverageIcon />;
      case 'sweets': return <CakeIcon />;
      case 'snacks': return <FastfoodIcon />;
      case 'rolls': return <LunchDiningIcon />;
      case 'bakery': return <CakeIcon />;
      default: return <RestaurantIcon />;
    }
  };

  const styles = {
    container: {
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      color: '#ffffff',
      position: 'relative',
    },
    heroSection: {
      background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%), url("https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=1600")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '120px 20px 100px',
      textAlign: 'center',
      position: 'relative',
      borderBottom: '3px solid #D4AF37',
      clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 50%, rgba(212,175,55,0.1) 0%, transparent 50%)',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '900px',
      margin: '0 auto',
    },
    title: {
      fontSize: '5rem',
      color: '#D4AF37',
      marginBottom: '10px',
      fontFamily: "'Cormorant Garamond', serif",
      textShadow: '0 0 30px rgba(212,175,55,0.5)',
      fontWeight: 700,
      letterSpacing: '4px',
    },
    subtitle: {
      fontSize: '1.4rem',
      color: '#e0e0e0',
      marginBottom: '50px',
      fontWeight: 300,
      letterSpacing: '1px',
    },
    searchContainer: {
      maxWidth: '700px',
      margin: '0 auto 40px',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '20px 70px 20px 30px',
      fontSize: '1.1rem',
      background: 'rgba(26,26,26,0.95)',
      border: '2px solid #D4AF37',
      borderRadius: '60px',
      color: '#fff',
      outline: 'none',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 10px 30px rgba(212,175,55,0.3)',
      transition: 'all 0.3s ease',
    },
    searchIcon: {
      position: 'absolute',
      right: '25px',
      top: '20px',
      color: '#D4AF37',
      fontSize: '30px',
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      marginTop: '30px',
      flexWrap: 'wrap',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(26,26,26,0.8)',
      padding: '12px 25px',
      borderRadius: '40px',
      border: '1px solid #D4AF37',
      backdropFilter: 'blur(5px)',
      fontSize: '1rem',
      color: '#D4AF37',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    trackButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(212,175,55,0.15)',
      padding: '12px 25px',
      borderRadius: '40px',
      border: '2px solid #D4AF37',
      backdropFilter: 'blur(5px)',
      fontSize: '1rem',
      color: '#D4AF37',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500',
    },
    trendingSection: {
      padding: '40px 20px',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
    },
    trendingTitle: {
      fontSize: '2rem',
      color: '#D4AF37',
      marginBottom: '30px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    trendingGrid: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
    trendingCard: {
      background: '#1a1a1a',
      borderRadius: '15px',
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      border: '1px solid #333',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    trendingImage: {
      width: '70px',
      height: '70px',
      borderRadius: '10px',
      objectFit: 'cover',
      border: '2px solid #D4AF37',
    },
    trendingInfo: {
      flex: 1,
    },
    trendingName: {
      fontSize: '1rem',
      color: '#fff',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    trendingPrice: {
      color: '#D4AF37',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    },
    resultsCount: {
      textAlign: 'left',
      padding: '10px 20px',
      color: '#888',
      fontSize: '0.9rem',
      maxWidth: '1200px',
      margin: '20px auto 0',
    },
    filterSection: {
      padding: '30px 20px',
      borderBottom: '1px solid #333',
      background: '#111',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'blur(10px)',
    },
    filterTabs: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    filterTab: {
      padding: '10px 25px',
      background: 'transparent',
      border: '2px solid #333',
      borderRadius: '40px',
      color: '#888',
      cursor: 'pointer',
      fontSize: '0.95rem',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    activeFilter: {
      borderColor: '#D4AF37',
      color: '#D4AF37',
      background: 'rgba(212,175,55,0.1)',
      boxShadow: '0 0 20px rgba(212,175,55,0.2)',
    },
    grid: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '30px',
    },
    restaurantCard: {
      background: '#1a1a1a',
      borderRadius: '20px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid #333',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    foodCard: {
      background: '#1a1a1a',
      borderRadius: '16px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid #333',
      display: 'flex',
      gap: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    foodImage: {
      width: '100px',
      height: '100px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '2px solid #D4AF37',
    },
    foodInfo: {
      flex: 1,
    },
    foodName: {
      fontSize: '1.2rem',
      color: '#fff',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    foodRestaurant: {
      fontSize: '0.9rem',
      color: '#D4AF37',
      marginBottom: '8px',
    },
    foodPrice: {
      fontSize: '1.3rem',
      color: '#D4AF37',
      fontWeight: 'bold',
    },
    restaurantImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderBottom: '2px solid #D4AF37',
    },
    restaurantInfo: {
      padding: '20px',
    },
    restaurantName: {
      fontSize: '1.4rem',
      color: '#fff',
      marginBottom: '5px',
    },
    restaurantCuisine: {
      color: '#D4AF37',
      fontSize: '0.95rem',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    restaurantMeta: {
      display: 'flex',
      gap: '20px',
      marginBottom: '15px',
      fontSize: '0.95rem',
      color: '#888',
    },
    featuredBadge: {
      background: '#D4AF37',
      color: '#1a1a1a',
      padding: '6px 15px',
      borderRadius: '25px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block',
    },
    popularBadge: {
      background: '#ff4444',
      color: '#fff',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      marginLeft: '8px',
      display: 'inline-block',
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 20px',
      color: '#888',
      background: '#1a1a1a',
      borderRadius: '20px',
      margin: '40px auto',
      maxWidth: '500px',
      border: '1px solid #333',
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section with Background Image */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <motion.h1 
            style={styles.title}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            YFC
          </motion.h1>
          <motion.p 
            style={styles.subtitle}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Favourite Coffee & More
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            style={styles.searchContainer}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search for food items (e.g., coffee, tea, samosa)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <SearchIcon style={styles.searchIcon} />
          </motion.div>

          {/* Stats Row with Track Order Button */}
          <motion.div 
            style={styles.statsRow}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div style={styles.statItem}>
              <LocalCafeIcon /> 50+ Items
            </div>
            <div style={styles.statItem}>
              <RestaurantIcon /> 3 Restaurants
            </div>
            <div style={styles.statItem}>
              <EmojiFoodBeverageIcon /> Free Delivery
            </div>
            {/* Track Order Button */}
            <motion.div 
              style={styles.trackButton}
              whileHover={{ scale: 1.05, background: 'rgba(212,175,55,0.25)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTracking(true)}
            >
              <TrackChangesIcon /> Track Order
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trending Items Section */}
      {!searchTerm && trendingItems.length > 0 && (
        <div style={styles.trendingSection}>
          <h2 style={styles.trendingTitle}>
            <TrendingUpIcon /> Trending Now <TrendingUpIcon />
          </h2>
          <div style={styles.trendingGrid}>
            {trendingItems.map((item, index) => (
              <motion.div
                key={item.id}
                style={styles.trendingCard}
                whileHover={{ y: -5, borderColor: '#D4AF37' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
              >
                <img src={item.image} alt={item.name} style={styles.trendingImage} />
                <div style={styles.trendingInfo}>
                  <div style={styles.trendingName}>{item.name}</div>
                  <div style={styles.foodRestaurant}>{item.restaurantName}</div>
                  <div style={styles.trendingPrice}>₹{item.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {searchTerm && (
        <div style={styles.resultsCount}>
          Found {searchResults.length} items for "{searchTerm}"
        </div>
      )}

      {/* Filter Tabs (only show when not searching) */}
      {!searchTerm && (
        <div style={styles.filterSection}>
          <div style={styles.filterTabs}>
            {cuisines.map(cuisine => (
              <button
                key={cuisine.id}
                style={{
                  ...styles.filterTab,
                  ...(selectedCuisine === cuisine.id ? styles.activeFilter : {})
                }}
                onClick={() => setSelectedCuisine(cuisine.id)}
              >
                <span>{cuisine.icon}</span>
                {cuisine.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      <AnimatePresence>
        <motion.div 
          style={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {viewMode === 'food' ? (
            // Show food items
            searchResults.map((item, index) => (
              <motion.div
                key={item.id}
                style={styles.foodCard}
                whileHover={{ y: -8, borderColor: '#D4AF37', boxShadow: '0 20px 40px rgba(212,175,55,0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/restaurant/${item.restaurantId}`, { state: { highlightItem: item.id } })}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={styles.foodImage}
                  onError={(e) => {
                    if (item.category === 'sweets') {
                      e.target.src = 'https://www.vegrecipesofindia.com/wp-content/uploads/2020/12/gulab-jamun-500x500.jpg';
                    } else if (item.category === 'tea') {
                      e.target.src = 'https://images.pexels.com/photos/1417946/pexels-photo-1417946.jpeg?w=500';
                    } else if (item.category === 'coffee') {
                      e.target.src = 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=500';
                    } else {
                      e.target.src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=500';
                    }
                  }}
                />
                <div style={styles.foodInfo}>
                  <div>
                    <span style={styles.foodName}>{item.name}</span>
                    {item.popular && <span style={styles.popularBadge}>🔥 POPULAR</span>}
                  </div>
                  <div style={styles.foodRestaurant}>
                    {getCategoryIcon(item.category)} {item.restaurantName} ⭐{item.restaurantRating}
                  </div>
                  <div style={styles.foodPrice}>₹{item.price}</div>
                </div>
              </motion.div>
            ))
          ) : (
            // Show restaurants
            (searchTerm ? searchResults : restaurants)
              .filter(r => selectedCuisine === 'all' || r.cuisine.toLowerCase().includes(selectedCuisine))
              .map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  style={styles.restaurantCard}
                  whileHover={{ y: -8, borderColor: '#D4AF37', boxShadow: '0 20px 40px rgba(212,175,55,0.2)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    style={styles.restaurantImage}
                  />
                  <div style={styles.restaurantInfo}>
                    <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                    <p style={styles.restaurantCuisine}>
                      {getCategoryIcon(restaurant.cuisine.split(' ')[0].toLowerCase())} {restaurant.cuisine}
                    </p>
                    
                    <div style={styles.restaurantMeta}>
                      <span>⭐ {restaurant.rating}</span>
                      <span>🕒 {restaurant.deliveryTime}</span>
                      <span>💰 ₹{restaurant.minOrder}</span>
                    </div>
                    
                    {restaurant.featured && (
                      <span style={styles.featuredBadge}>✨ FEATURED</span>
                    )}
                  </div>
                </motion.div>
              ))
          )}
        </motion.div>
      </AnimatePresence>

      {searchTerm && searchResults.length === 0 && (
        <motion.div 
          style={styles.emptyState}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>No items found</h3>
          <p>Try searching for something else</p>
        </motion.div>
      )}

      {/* Order Tracking Modal */}
      <AnimatePresence>
        {showTracking && (
          <OrderTracking onClose={() => setShowTracking(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default HomePage;