import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';

function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [viewMode, setViewMode] = useState('restaurants');
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

  const cuisines = ['all', 'coffee', 'tea', 'sweets', 'snacks', 'rolls', 'bakery'];

  const styles = {
    container: {
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      color: '#ffffff',
      position: 'relative',
    },
    heroSection: {
      background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url("https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=1600")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      padding: '100px 20px',
      textAlign: 'center',
      position: 'relative',
      borderBottom: '2px solid #D4AF37',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at center, transparent 0%, #0a0a0a 80%)',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '4rem',
      color: '#D4AF37',
      marginBottom: '10px',
      fontFamily: "'Cormorant Garamond', serif",
      textShadow: '0 0 20px rgba(212,175,55,0.3)',
    },
    subtitle: {
      fontSize: '1.3rem',
      color: '#ccc',
      marginBottom: '40px',
    },
    searchContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '18px 60px 18px 25px',
      fontSize: '1.1rem',
      background: 'rgba(26,26,26,0.9)',
      border: '2px solid #D4AF37',
      borderRadius: '50px',
      color: '#fff',
      outline: 'none',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 5px 20px rgba(212,175,55,0.2)',
    },
    searchIcon: {
      position: 'absolute',
      right: '25px',
      top: '18px',
      color: '#D4AF37',
      fontSize: '28px',
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      marginTop: '30px',
      color: '#D4AF37',
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(26,26,26,0.8)',
      padding: '10px 20px',
      borderRadius: '30px',
      border: '1px solid #D4AF37',
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
      padding: '20px',
      borderBottom: '1px solid #333',
      background: '#111',
    },
    filterTabs: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    filterTab: {
      padding: '8px 20px',
      background: 'transparent',
      border: '2px solid #333',
      borderRadius: '30px',
      color: '#888',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s',
    },
    activeFilter: {
      borderColor: '#D4AF37',
      color: '#D4AF37',
      background: 'rgba(212,175,55,0.1)',
    },
    grid: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px',
    },
    restaurantCard: {
      background: '#1a1a1a',
      borderRadius: '15px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
      border: '1px solid #333',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    },
    foodCard: {
      background: '#1a1a1a',
      borderRadius: '12px',
      padding: '15px',
      cursor: 'pointer',
      transition: 'transform 0.3s',
      border: '1px solid #333',
      display: 'flex',
      gap: '15px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    },
    foodImage: {
      width: '90px',
      height: '90px',
      borderRadius: '10px',
      objectFit: 'cover',
      border: '2px solid #D4AF37',
    },
    foodInfo: {
      flex: 1,
    },
    foodName: {
      fontSize: '1.1rem',
      color: '#fff',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    foodRestaurant: {
      fontSize: '0.85rem',
      color: '#D4AF37',
      marginBottom: '5px',
    },
    foodPrice: {
      fontSize: '1.2rem',
      color: '#D4AF37',
      fontWeight: 'bold',
    },
    restaurantImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
      borderBottom: '2px solid #D4AF37',
    },
    restaurantInfo: {
      padding: '15px',
    },
    restaurantName: {
      fontSize: '1.3rem',
      color: '#fff',
      marginBottom: '5px',
    },
    restaurantCuisine: {
      color: '#D4AF37',
      fontSize: '0.9rem',
      marginBottom: '10px',
    },
    restaurantMeta: {
      display: 'flex',
      gap: '15px',
      marginBottom: '10px',
      fontSize: '0.9rem',
      color: '#888',
    },
    featuredBadge: {
      background: '#D4AF37',
      color: '#1a1a1a',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      display: 'inline-block',
    },
    popularBadge: {
      background: '#ff4444',
      color: '#fff',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      marginLeft: '8px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#888',
      background: '#1a1a1a',
      borderRadius: '15px',
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
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            YFC
          </motion.h1>
          <p style={styles.subtitle}>Your Favourite Coffee & More</p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              style={styles.searchInput}
              placeholder="Search for food items (e.g., coffee, tea, samosa)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <SearchIcon style={styles.searchIcon} />
          </div>

          {/* Stats Row */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <LocalCafeIcon /> 50+ Items
            </div>
            <div style={styles.statItem}>
              <RestaurantIcon /> 3 Restaurants
            </div>
            <div style={styles.statItem}>
              <EmojiFoodBeverageIcon /> Free Delivery
            </div>
          </div>
        </div>
      </div>

      {searchTerm && (
        <div style={styles.resultsCount}>
          Found {viewMode === 'food' ? searchResults.length : searchResults.length} items for "{searchTerm}"
        </div>
      )}

      {/* Filter Tabs (only show when not searching) */}
      {!searchTerm && (
        <div style={styles.filterSection}>
          <div style={styles.filterTabs}>
            {cuisines.map(cuisine => (
              <button
                key={cuisine}
                style={{
                  ...styles.filterTab,
                  ...(selectedCuisine === cuisine ? styles.activeFilter : {})
                }}
                onClick={() => setSelectedCuisine(cuisine)}
              >
                {cuisine === 'all' ? 'All' : cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div style={styles.grid}>
        {viewMode === 'food' ? (
          // Show food items
          searchResults.map((item) => (
            <motion.div
              key={item.id}
              style={styles.foodCard}
              whileHover={{ y: -5, borderColor: '#D4AF37', boxShadow: '0 10px 30px rgba(212,175,55,0.2)' }}
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
                  {item.popular && <span style={styles.popularBadge}>🔥</span>}
                </div>
                <div style={styles.foodRestaurant}>
                  from {item.restaurantName} ⭐{item.restaurantRating}
                </div>
                <div style={styles.foodPrice}>₹{item.price}</div>
              </div>
            </motion.div>
          ))
        ) : (
          // Show restaurants
          (searchTerm ? searchResults : restaurants)
            .filter(r => selectedCuisine === 'all' || r.cuisine.toLowerCase().includes(selectedCuisine))
            .map((restaurant) => (
              <motion.div
                key={restaurant.id}
                style={styles.restaurantCard}
                whileHover={{ y: -5, borderColor: '#D4AF37', boxShadow: '0 10px 30px rgba(212,175,55,0.2)' }}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  style={styles.restaurantImage}
                />
                <div style={styles.restaurantInfo}>
                  <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                  <p style={styles.restaurantCuisine}>{restaurant.cuisine}</p>
                  
                  <div style={styles.restaurantMeta}>
                    <span>⭐ {restaurant.rating}</span>
                    <span>🕒 {restaurant.deliveryTime}</span>
                    <span>💰 ₹{restaurant.minOrder}</span>
                  </div>
                  
                  {restaurant.featured && (
                    <span style={styles.featuredBadge}>Featured</span>
                  )}
                </div>
              </motion.div>
            ))
        )}
      </div>

      {searchTerm && searchResults.length === 0 && (
        <div style={styles.emptyState}>
          <h3>No items found</h3>
          <p>Try searching for something else</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;