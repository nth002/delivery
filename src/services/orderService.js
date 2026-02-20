// SIMPLE STORAGE SERVICE - No automatic downloads!
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
      
      // Save to localStorage ONLY - no download!
      localStorage.setItem('yfc_orders', JSON.stringify(orders));
      
      console.log('✅ Order saved to localStorage:', newOrder);
      
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
  }
};