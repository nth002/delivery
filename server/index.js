const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database path
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT UNIQUE,
      customerName TEXT,
      customerPhone TEXT,
      address TEXT,
      items TEXT,
      total REAL,
      paymentMethod TEXT,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Database initialized at:', dbPath);
});

// API Routes

// Get all orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
      return;
    }
    // Parse items JSON
    const orders = rows.map(row => ({
      ...row,
      items: JSON.parse(row.items || '[]')
    }));
    res.json(orders);
  });
});

// Add new order
app.post('/api/orders', (req, res) => {
  const { orderId, customerName, customerPhone, address, items, total, paymentMethod } = req.body;
  
  db.run(
    'INSERT INTO orders (orderId, customerName, customerPhone, address, items, total, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [orderId, customerName, customerPhone, address, JSON.stringify(items), total, paymentMethod],
    function(err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, success: true });
    }
  );
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  db.run(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    }
  );
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM orders WHERE id = ?', id, function(err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

// Get order statistics
app.get('/api/stats', (req, res) => {
  db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
      SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as totalEarnings,
      SUM(CASE WHEN date(createdAt) = date('now') AND status = 'completed' THEN total ELSE 0 END) as todayEarnings
    FROM orders
  `, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Access from other devices using: http://YOUR_IP_ADDRESS:${PORT}`);
});