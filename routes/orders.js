const express = require('express');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all orders (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, status } = req.body;

    console.log('Creating order with payment method:', paymentMethod);

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress: {
        ...shippingAddress,
        // Backward compatibility
        address: shippingAddress.street || shippingAddress.address,
        state: shippingAddress.province || shippingAddress.state,
        zipCode: shippingAddress.postalCode || shippingAddress.zipCode
      },
      paymentMethod: paymentMethod || 'cash_on_delivery',
      status: status || 'pending'
    });

    await order.save();

    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email');

    // Send notification to admin
    sendOrderNotificationToAdmin(populatedOrder, req.user);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order: ' + error.message
    });
  }
});

// Update order status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    // Find the current order first
    const currentOrder = await Order.findById(req.params.id);
    
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(notes && { notes })
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
});

// Delete order (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order'
    });
  }
});

// Function to send notification to admin
function sendOrderNotificationToAdmin(order, user) {
  try {
    console.log('\n📦 ========== NEW ORDER NOTIFICATION ========== 📦');
    console.log('🆔 Order ID:', order._id);
    console.log('👤 Customer:', order.shippingAddress?.name || user.name);
    console.log('📧 Email:', user.email);
    console.log('📞 Phone:', order.shippingAddress?.phone);
    console.log('💰 Total Amount: Rs.', order.totalAmount?.toLocaleString());
    console.log('💳 Payment Method:', order.paymentMethod);
    console.log('📍 Shipping Address:', order.shippingAddress?.street || order.shippingAddress?.address);
    console.log('🏙️ City:', order.shippingAddress?.city);
    console.log('🏛️ Province:', order.shippingAddress?.province || order.shippingAddress?.state);
    console.log('📮 Postal Code:', order.shippingAddress?.postalCode || order.shippingAddress?.zipCode);
    console.log('📋 Order Items:');
    order.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} - Qty: ${item.quantity} - Rs. ${item.price} each`);
    });
    console.log('===============================================\n');
    
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

module.exports = router;