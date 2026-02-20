import Dexie from 'dexie';

// Create database
export const db = new Dexie('yfcOrders');

// Define database schema
db.version(1).stores({
  orders: '++id, orderId, customerName, customerPhone, status, orderDate, total, paymentMethod, address, items, createdAt'
});

// Add a new order
export const addOrder = async (orderData) => {
  try {
    const id = await db.orders.add({
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Order saved with ID:', id);
    return id;
  } catch (error) {
    console.error('❌ Error saving order:', error);
    throw error;
  }
};

// Get all orders
export const getOrders = async () => {
  try {
    const orders = await db.orders.toArray();
    console.log('✅ Retrieved orders:', orders.length);
    return orders;
  } catch (error) {
    console.error('❌ Error getting orders:', error);
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    await db.orders.update(id, { status });
    console.log('✅ Order status updated:', id, status);
    return true;
  } catch (error) {
    console.error('❌ Error updating order:', error);
    return false;
  }
};

// Delete order
export const deleteOrder = async (id) => {
  try {
    await db.orders.delete(id);
    console.log('✅ Order deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    return false;
  }
};