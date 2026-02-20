// For Netlify deployment - use your Render/Railway backend URL
// If you don't have a hosted backend yet, we need to create one

// TEMPORARY FIX - Use a hosted backend service
// You need to deploy your backend to Render/Railway first
const API_URL = 'https://your-backend-url.onrender.com/api'; // Replace with your actual backend URL

export const orderService = {
  // Get all orders
  async getAllOrders() {
    try {
      console.log('Fetching from:', API_URL + '/orders');
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Add new order
  async addOrder(orderData) {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Update order status
  async updateStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  },

  // Delete order
  async deleteOrder(id) {
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get statistics
  async getStats() {
    try {
      const response = await fetch(`${API_URL}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        totalEarnings: 0,
        todayEarnings: 0
      };
    }
  }
};