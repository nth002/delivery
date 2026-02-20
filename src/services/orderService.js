// Direct SQLite connection - reads from your src/db.sqlite3 file
import initSqlJs from 'sql.js';

// Path to your SQLite file in public folder
const DB_PATH = '/db.sqlite3';

let db = null;

export const sqliteService = {
  // Initialize database from file
  async initDB() {
    if (!db) {
      try {
        // Load SQL.js
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        });

        // Fetch your SQLite file from public folder
        const response = await fetch(DB_PATH);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Load database
        db = new SQL.Database(uint8Array);
        console.log('✅ Database loaded from:', DB_PATH);
        
        // Check if tables exist, create if not
        this.ensureTables();
      } catch (error) {
        console.error('❌ Error loading database:', error);
        // Create new database if file doesn't exist
        const SQL = await initSqlJs();
        db = new SQL.Database();
        this.createTables();
        this.saveToFile();
      }
    }
    return db;
  },

  // Ensure tables exist
  ensureTables() {
    try {
      // Check if orders table exists
      const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'");
      if (result.length === 0) {
        this.createTables();
      }
    } catch (error) {
      this.createTables();
    }
  },

  // Create tables
  createTables() {
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
      );
    `);
    console.log('✅ Tables created');
  },

  // Save database to file (download for backup)
  saveToFile() {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'db.sqlite3';
    a.click();
  },

  // Get all orders
  async getAllOrders() {
    await this.initDB();
    try {
      const result = db.exec("SELECT * FROM orders ORDER BY createdAt DESC");
      
      if (result.length === 0) return [];
      
      const columns = result[0].columns;
      const values = result[0].values;
      
      return values.map(row => {
        const order = {};
        columns.forEach((col, i) => {
          if (col === 'items') {
            try {
              order[col] = JSON.parse(row[i]);
            } catch {
              order[col] = [];
            }
          } else {
            order[col] = row[i];
          }
        });
        return order;
      });
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  },

  // Add order
  async addOrder(orderData) {
    await this.initDB();
    try {
      const stmt = db.prepare(`
        INSERT INTO orders (orderId, customerName, customerPhone, address, items, total, paymentMethod)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        orderData.orderId,
        orderData.customerName,
        orderData.customerPhone,
        orderData.address,
        JSON.stringify(orderData.items),
        orderData.total,
        orderData.paymentMethod
      ]);
      
      // Get the last insert ID
      const idResult = db.exec("SELECT last_insert_rowid()");
      const id = idResult[0]?.values[0][0];
      
      // Download updated database
      this.saveToFile();
      
      return { success: true, id };
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Update status
  async updateStatus(id, status) {
    await this.initDB();
    try {
      db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
      this.saveToFile();
      return { success: true };
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false };
    }
  },

  // Delete order
  async deleteOrder(id) {
    await this.initDB();
    try {
      db.run(`DELETE FROM orders WHERE id = ?`, [id]);
      this.saveToFile();
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { success: false };
    }
  },

  // Get statistics
  async getStats() {
    await this.initDB();
    try {
      const total = db.exec("SELECT COUNT(*) FROM orders")[0]?.values[0][0] || 0;
      const pending = db.exec("SELECT COUNT(*) FROM orders WHERE status = 'pending'")[0]?.values[0][0] || 0;
      const completed = db.exec("SELECT COUNT(*) FROM orders WHERE status = 'completed'")[0]?.values[0][0] || 0;
      const cancelled = db.exec("SELECT COUNT(*) FROM orders WHERE status = 'cancelled'")[0]?.values[0][0] || 0;
      
      const totalEarnings = db.exec("SELECT SUM(total) FROM orders WHERE status = 'completed'")[0]?.values[0][0] || 0;
      
      const todayEarnings = db.exec(`
        SELECT SUM(total) FROM orders 
        WHERE status = 'completed' 
        AND date(createdAt) = date('now')
      `)[0]?.values[0][0] || 0;
      
      return {
        total,
        pending,
        completed,
        cancelled,
        totalEarnings,
        todayEarnings
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        totalEarnings: 0,
        todayEarnings: 0
      };
    }
  },

  // Search orders by phone
  async searchByPhone(phone) {
    await this.initDB();
    try {
      const result = db.exec(`
        SELECT * FROM orders 
        WHERE customerPhone LIKE '%${phone}%' 
        ORDER BY createdAt DESC
      `);
      
      if (result.length === 0) return [];
      
      const columns = result[0].columns;
      const values = result[0].values;
      
      return values.map(row => {
        const order = {};
        columns.forEach((col, i) => {
          if (col === 'items') {
            try {
              order[col] = JSON.parse(row[i]);
            } catch {
              order[col] = [];
            }
          } else {
            order[col] = row[i];
          }
        });
        return order;
      });
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  }
};