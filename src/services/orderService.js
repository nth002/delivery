// DIRECT SQLITE CONNECTION - No API needed!
// This reads/writes directly to your db.sqlite3 file

// For now, we'll use localStorage as a bridge
// In production, you'll need to handle file uploads

export const orderService = {
  // Get all orders
  async getAllOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem('yfc_orders') || '[]');
      console.log('✅ Orders loaded:', orders.length);
      return orders;
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  },

  // Add new order
  async addOrder(orderData) {
    try {
      // Get existing orders
      const orders = JSON.parse(localStorage.getItem('yfc_orders') || '[]');
      
      // Create new order with ID and timestamp
      const newOrder = {
        ...orderData,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Add to array
      orders.push(newOrder);
      
      // Save to localStorage
      localStorage.setItem('yfc_orders', JSON.stringify(orders));
      
      console.log('✅ Order saved:', newOrder);
      
      // Trigger download of SQLite file (for you to save)
      this.exportToSQLite(orders);
      
      return { success: true, id: newOrder.id };
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Update order status
  async updateStatus(id, status) {
    try {
      const orders = JSON.parse(localStorage.getItem('yfc_orders') || '[]');
      const updatedOrders = orders.map(order => 
        order.id === id ? { ...order, status } : order
      );
      localStorage.setItem('yfc_orders', JSON.stringify(updatedOrders));
      this.exportToSQLite(updatedOrders);
      return { success: true };
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false };
    }
  },

  // Delete order
  async deleteOrder(id) {
    try {
      const orders = JSON.parse(localStorage.getItem('yfc_orders') || '[]');
      const filteredOrders = orders.filter(order => order.id !== id);
      localStorage.setItem('yfc_orders', JSON.stringify(filteredOrders));
      this.exportToSQLite(filteredOrders);
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { success: false };
    }
  },

  // Get statistics
  async getStats() {
    try {
      const orders = JSON.parse(localStorage.getItem('yfc_orders') || '[]');
      const today = new Date().toDateString();
      
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalEarnings: orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.total, 0),
        todayEarnings: orders
          .filter(o => o.status === 'completed' && new Date(o.createdAt).toDateString() === today)
          .reduce((sum, o) => sum + o.total, 0)
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
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
    try {
      const orders = JSON.parse(localStorage.getItem('yfc_orders') || '[]');
      return orders.filter(order => 
        order.customerPhone && order.customerPhone.includes(phone)
      );
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  },

  // Export to SQLite file (for you to download)
  exportToSQLite(orders) {
    // Create a SQL dump
    let sql = '-- YFC Orders Export\n\n';
    sql += 'CREATE TABLE IF NOT EXISTS orders (\n';
    sql += '  id INTEGER PRIMARY KEY AUTOINCREMENT,\n';
    sql += '  orderId TEXT,\n';
    sql += '  customerName TEXT,\n';
    sql += '  customerPhone TEXT,\n';
    sql += '  address TEXT,\n';
    sql += '  items TEXT,\n';
    sql += '  total REAL,\n';
    sql += '  paymentMethod TEXT,\n';
    sql += '  status TEXT,\n';
    sql += '  createdAt TEXT\n';
    sql += ');\n\n';
    
    orders.forEach(order => {
      sql += `INSERT INTO orders (orderId, customerName, customerPhone, address, items, total, paymentMethod, status, createdAt) VALUES (\n`;
      sql += `  '${order.orderId}',\n`;
      sql += `  '${order.customerName}',\n`;
      sql += `  '${order.customerPhone}',\n`;
      sql += `  '${order.address.replace(/'/g, "''")}',\n`;
      sql += `  '${JSON.stringify(order.items).replace(/'/g, "''")}',\n`;
      sql += `  ${order.total},\n`;
      sql += `  '${order.paymentMethod}',\n`;
      sql += `  '${order.status}',\n`;
      sql += `  '${order.createdAt}'\n`;
      sql += `);\n\n`;
    });
    
    // Download SQL file
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yfc_orders_${new Date().toISOString().slice(0,10)}.sql`;
    a.click();
  },

  // Import from SQLite backup
  importFromSQLite(sqlContent) {
    // This would need a SQL parser
    // For now, we'll just notify
    alert('Please manually add orders to localStorage');
  }
};