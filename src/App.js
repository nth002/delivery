// App.js - COMPLETELY FIXED WITH ALL INDIAN FOOD IMAGES
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantPage from './pages/RestaurantPage';
import './App.css';
import { Toaster } from 'react-hot-toast';

// Image mapping for each food item - USING REAL INDIAN FOOD IMAGES
const foodImages = {
  // Coffee items
  '✨ SPECIAL CREAMY COFFEE': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=500',
  'NORMAL COFFEE': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=500',
  'COLD COFFEE': 'https://plus.unsplash.com/premium_photo-1663933534262-5de49eb4f59f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sZCUyMGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D', // Fixed: Cold coffee with ice
  
  // Tea items - FIXED with proper Indian tea images
  'MASALA TEA': 'https://im.whatshot.in/img/2019/Sep/shutterstock-1024718095-1-1567682800.jpg', // Indian masala chai
  'GINGER TEA': 'https://media.istockphoto.com/id/914152174/photo/hot-ginger-tea-cup-with-ginger-roots-on-wood-background.jpg?s=612x612&w=0&k=20&c=Eal1OfhEgVC62erwQUFxhZKDkPgEjUByCYI9FcHLzN4=', // Indian tea
  
  // Rolls
  'EGG ROLL': 'https://i.ytimg.com/vi/p_Lq7l8JCYY/maxresdefault.jpg',
  'VEG ROLL': 'https://i.ytimg.com/vi/6Olh2qOht2E/maxresdefault.jpg',
  
  // Bakery
  'PASTREE': 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?w=500',
  'BIRTHDAY CAKE (1/2 KG)': 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?w=500',
  
  // INDIAN SWEETS
  'DAIRY MILK': 'https://images.unsplash.com/photo-1638275995244-26a3f3a2ed49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFpcnklMjBtaWxrfGVufDB8fDB8fHww',
  'RASGULLA (PER PIECE)': 'https://images.pond5.com/famous-bengali-or-indian-sweets-footage-278852815_iconl.jpeg',
  'GULAB JAMUN': 'https://wallpapercave.com/wp/wp2157192.jpg',
  'JALEBI': 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/jalebi-500x500.jpg',
  'ROSOGOLLA': 'https://images.pond5.com/famous-bengali-or-indian-sweets-footage-278852815_iconl.jpeg',
  'SANDESH': 'https://media.istockphoto.com/id/2184678599/photo/rasgulla.webp?a=1&b=1&s=612x612&w=0&k=20&c=CbNrIqR6TCd7pSbc85niJOciNHnPBeoK-pmtoNX5nj4=',
  'MISHTI DOI': 'https://cdn.prod.website-files.com/64931d2aee18510b47f4bb1f/6685ac20f1316f7a50ffe27c_Mishti-Doi-Recipe-Cover-Image.jpg',
  
  // Snacks
  'BISCUITS - SMALL PACK': 'https://images.pexels.com/photos/1895367/pexels-photo-1895367.jpeg?w=500',
  'BISCUITS - FAMILY PACK': 'https://images.pexels.com/photos/1895367/pexels-photo-1895367.jpeg?w=500',
  'SAMOSA': 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/samosa-recipe-500x500.jpg',
  'KACHORI': 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/kachori-recipe-500x500.jpg',
  
  // Momos
  'VEG MOMOS': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?w=500',
  'NON-VEG MOMOS': 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?w=500',
  
  // Combo
  'SANDWICH + JUICE COMBO': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=500',
};

// Default fallback image
const FALLBACK_IMAGE = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=500';

// Initialize restaurants and their menus
const initializeData = () => {
  // Clear old data
  localStorage.removeItem('restaurants');
  
  const restaurants = [
    {
      id: 'yfc_1',
      name: 'YFC - Your Favourite Coffee',
      image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=500',
      cuisine: 'Coffee & Snacks',
      rating: 4.5,
      deliveryTime: '30-40 min',
      minOrder: 50,
      featured: true,
      menu: [
        { 
          id: 'yfc_coffee_1', 
          name: '✨ SPECIAL CREAMY COFFEE', 
          price: 50, 
          category: 'coffee', 
          description: 'Signature 150-200ml Cappuccino', 
          popular: true,
          image: foodImages['✨ SPECIAL CREAMY COFFEE']
        },
        { 
          id: 'yfc_coffee_2', 
          name: 'NORMAL COFFEE', 
          price: 20, 
          category: 'coffee', 
          description: 'Fresh brewed regular coffee',
          image: foodImages['NORMAL COFFEE']
        },
        { 
          id: 'yfc_coffee_3', 
          name: 'COLD COFFEE', 
          price: 30, 
          category: 'coffee', 
          description: 'Chilled creamy coffee',
          image: foodImages['COLD COFFEE']
        },
        { 
          id: 'yfc_rolls_1', 
          name: 'EGG ROLL', 
          price: 60, 
          category: 'rolls', 
          description: 'Spicy egg wrapped in paratha',
          image: foodImages['EGG ROLL']
        },
        { 
          id: 'yfc_rolls_2', 
          name: 'VEG ROLL', 
          price: 50, 
          category: 'rolls', 
          description: 'Fresh vegetable roll',
          image: foodImages['VEG ROLL']
        },
        { 
          id: 'yfc_bakery_1', 
          name: 'PASTREE', 
          price: 40, 
          category: 'bakery', 
          description: 'Fresh cream pastry', 
          popular: true,
          image: foodImages['PASTREE']
        },
        { 
          id: 'yfc_bakery_2', 
          name: 'BIRTHDAY CAKE (1/2 KG)', 
          price: 300, 
          category: 'bakery', 
          description: 'Customizable birthday cake', 
          popular: true,
          image: foodImages['BIRTHDAY CAKE (1/2 KG)']
        },
        { 
          id: 'yfc_sweets_1', 
          name: 'DAIRY MILK', 
          price: 10, 
          category: 'sweets', 
          description: 'Creamy milk sweet',
          image: foodImages['DAIRY MILK']
        },
        { 
          id: 'yfc_sweets_2', 
          name: 'RASGULLA (PER PIECE)', 
          price: 10, 
          category: 'sweets', 
          description: 'Soft & spongy Bengali sweet',
          image: foodImages['RASGULLA (PER PIECE)']
        }
      ]
    },
    {
      id: 'ratan_1',
      name: 'Ratan Tea & Snacks',
      image: 'https://www.shutterstock.com/shutterstock/videos/1107501367/thumb/1.jpg?ip=x480',
      cuisine: 'Tea, Snacks & Sweets',
      rating: 4.3,
      deliveryTime: '25-35 min',
      minOrder: 30,
      featured: true,
      menu: [
        { 
          id: 'ratan_tea_1', 
          name: 'MASALA TEA', 
          price: 15, 
          category: 'tea', 
          description: 'Fresh brewed masala tea',
          image: foodImages['MASALA TEA']
        },
        { 
          id: 'ratan_tea_2', 
          name: 'GINGER TEA', 
          price: 20, 
          category: 'tea', 
          description: 'Refreshing ginger tea',
          image: foodImages['GINGER TEA']
        },
     
        { 
          id: 'ratan_sweets_1', 
          name: 'GULAB JAMUN', 
          price: 20, 
          category: 'sweets', 
          description: '2 pieces - Hot & soft',
          popular: true,
          image: foodImages['GULAB JAMUN']
        },
      
      ]
    },
    {
      id: 'sweet_1',
      name: 'Bengal Sweets',
      image: 'https://content.jdmagicbox.com/comp/ludhiana/g4/0161px161.x161.181004113418.y7g4/catalogue/bengali-sweets-ludhiana-0ffhyapkqz.jpg',
      cuisine: 'Bengali Sweets',
      rating: 4.7,
      deliveryTime: '35-45 min',
      minOrder: 100,
      featured: true,
      menu: [
        { 
          id: 'bengal_1', 
          name: 'ROSOGOLLA', 
          price: 120, 
          category: 'sweets', 
          description: '4 pieces - Soft & spongy',
          popular: true,
          image: foodImages['ROSOGOLLA']
        },
    
        { 
          id: 'bengal_3', 
          name: 'MISHTI DOI', 
          price: 150, 
          category: 'sweets', 
          description: 'Sweet yogurt - 200ml',
          popular: true,
          image: foodImages['MISHTI DOI']
        }
      ]
    }
  ];
  
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
  console.log('✅ Restaurants initialized with all images fixed');
};

function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #D4AF37',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;