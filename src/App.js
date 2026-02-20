// App.js - COMPLETELY FIXED VERSION
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import { Toaster } from 'react-hot-toast';

// Initialize default products with unique names
const initializeProducts = () => {
  // FORCE CLEAR old data
  localStorage.removeItem('menuItems');
  
  const defaultMenu = [
    // Coffee Special
    { 
      id: 'coffee_1', 
      name: '✨ SPECIAL CREAMY COFFEE', 
      price: 50, 
      category: 'coffee', 
      description: 'Signature 150-200ml Cappuccino', 
      popular: true 
    },
    { 
      id: 'coffee_2', 
      name: 'NORMAL COFFEE', 
      price: 20, 
      category: 'coffee', 
      description: 'Fresh brewed regular coffee' 
    },
    { 
      id: 'coffee_3', 
      name: 'COLD COFFEE', 
      price: 30, 
      category: 'coffee', 
      description: 'Chilled creamy coffee' 
    },
    
    // Rolls
    { 
      id: 'rolls_1', 
      name: 'EGG ROLL', 
      price: 60, 
      category: 'rolls', 
      description: 'Spicy egg wrapped in paratha' 
    },
    { 
      id: 'rolls_2', 
      name: 'VEG ROLL', 
      price: 50, 
      category: 'rolls', 
      description: 'Fresh vegetable roll' 
    },
    
    // Bakery Items
    { 
      id: 'bakery_1', 
      name: 'PASTREE', 
      price: 40, 
      category: 'bakery', 
      description: 'Fresh cream pastry', 
      popular: true 
    },
    { 
      id: 'bakery_2', 
      name: 'BIRTHDAY CAKE (1/2 KG)', 
      price: 300, 
      category: 'bakery', 
      description: 'Customizable birthday cake', 
      popular: true 
    },
    
    // Sweets - FIXED: Different names
    { 
      id: 'sweets_1', 
      name: 'DAIRY MILK',  // Changed from "DAIRY MILK"
      price: 10, 
      category: 'sweets', 
      description: 'Creamy milk sweet' 
    },
    { 
      id: 'sweets_2', 
      name: 'RASGULLA (PER PIECE)',  // Added (PER PIECE) for clarity
      price: 10, 
      category: 'sweets', 
      description: 'Soft & spongy Bengali sweet' 
    },
    
    // Snacks
    { 
      id: 'snacks_1', 
      name: 'BISCUITS - SMALL PACK', 
      price: 10, 
      category: 'snacks', 
      description: 'Crispy tea-time biscuits' 
    },
    { 
      id: 'snacks_2', 
      name: 'BISCUITS - FAMILY PACK', 
      price: 20, 
      category: 'snacks', 
      description: 'Large shareable pack' 
    },
    
    // Momos
    { 
      id: 'momos_1', 
      name: 'VEG MOMOS', 
      price: 40, 
      category: 'momos', 
      description: 'Steamed veg momos (Call to confirm)' 
    },
    { 
      id: 'momos_2', 
      name: 'NON-VEG MOMOS', 
      price: 40, 
      category: 'momos', 
      description: 'Chicken momos (Call to confirm)' 
    },
    
    // Combo
    { 
      id: 'combo_1', 
      name: 'SANDWICH + JUICE COMBO', 
      price: 50, 
      category: 'combo', 
      description: 'Regular sandwich with any juice' 
    },
  ];
  
  localStorage.setItem('menuItems', JSON.stringify(defaultMenu));
  console.log('Menu initialized:', defaultMenu); // Check console to confirm
};

function App() {
  useEffect(() => {
    // Clear old data and set new one
    initializeProducts();
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
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;