const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const axios = require('axios');

// Send confirmation message
async function sendOrderConfirmation(order, customer) {
  try {
    const message = `✅ Order Confirmed!\n\nThank you for shopping with FashionHub! ❤️\n\n📦 Order ID: #${order.orderId}\n💰 Total Amount: Rs ${order.totalAmount}\n🚚 Delivery: 3-5 working days\n📍 Address: ${order.deliveryAddress || 'Not provided'}\n\nHum aapka order jald bhej dein ge!\nTracking details share ki jayengi. 😊`;

    // Send via Instagram if customer has Instagram ID
    if (customer?.instagramId) {
      await axios.post(
        `https://graph.facebook.com/v21.0/me/messages`,
        {
          recipient: { id: customer.instagramId },
          message: { text: message }
        },
        { params: { access_token: process.env.PAGE_ACCESS_TOKEN } }
      );
    }

    // Send via WhatsApp if customer has phone
    if (customer?.phone) {
      await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: customer.phone,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log('Order confirmation sent!');
  } catch (error) {
    console.error('Confirmation error:', error.response?.data || error.message);
  }
}

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId').populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId').populate('products.productId');
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    order.orderId = 'ORD-' + Date.now();
    await order.save();

    // Send confirmation
    const customer = await Customer.findById(order.customerId);
    await sendOrderConfirmation(order, customer);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;