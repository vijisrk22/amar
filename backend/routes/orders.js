const express = require('express');
const { getDb } = require('../database');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// POST /api/orders — place an order (checkout)
router.post('/', (req, res) => {
  const db = getDb();
  const { email, name, phone, address_line1, address_line2, city, state, postal_code, country, session_id, payment_method } = req.body;
  const userId = req.user?.id;

  if (!email || !name || !address_line1 || !city || !state || !postal_code) {
    return res.status(400).json({ error: 'Required fields: email, name, address_line1, city, state, postal_code' });
  }

  // Get cart items
  let cartItems;
  if (userId) {
    cartItems = db.prepare(`
      SELECT ci.*, b.title, b.price, b.status FROM cart_items ci
      JOIN books b ON ci.book_id = b.id WHERE ci.user_id = ?
    `).all(userId);
  } else if (session_id) {
    cartItems = db.prepare(`
      SELECT ci.*, b.title, b.price, b.status FROM cart_items ci
      JOIN books b ON ci.book_id = b.id WHERE ci.session_id = ?
    `).all(session_id);
  } else {
    return res.status(400).json({ error: 'No cart found' });
  }

  if (!cartItems.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Get settings for shipping & tax
  const settingsRows = db.prepare('SELECT key, value FROM site_settings WHERE key IN (?, ?, ?)').all('shipping_cost', 'free_shipping_threshold', 'tax_rate');
  const settings = {};
  settingsRows.forEach(r => { settings[r.key] = parseFloat(r.value); });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= (settings.free_shipping_threshold || 3000) ? 0 : (settings.shipping_cost || 100);
  const tax = Math.round(subtotal * (settings.tax_rate || 0.05) * 100) / 100;
  const total = subtotal + shipping + tax;

  const orderNumber = 'ML-' + Date.now().toString(36).toUpperCase() + '-' + uuidv4().split('-')[0].toUpperCase();

  // Create order
  const orderResult = db.prepare(`
    INSERT INTO orders (order_number, user_id, email, name, phone, address_line1, address_line2, city, state, postal_code, country, subtotal, shipping, tax, total, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(orderNumber, userId || null, email, name, phone || null, address_line1, address_line2 || null, city, state, postal_code, country || 'India', subtotal, shipping, tax, total, payment_method || 'cod');

  const orderId = orderResult.lastInsertRowid;

  // Create order items
  const insertItem = db.prepare('INSERT INTO order_items (order_id, book_id, title, price, quantity) VALUES (?, ?, ?, ?, ?)');
  for (const item of cartItems) {
    insertItem.run(orderId, item.book_id, item.title, item.price, item.quantity);
  }

  // Clear cart
  if (userId) {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
  } else {
    db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(session_id);
  }

  res.status(201).json({
    order: {
      id: orderId,
      order_number: orderNumber,
      email, name, subtotal, shipping, tax, total,
      status: 'pending',
      payment_status: 'pending',
    }
  });
});

// GET /api/orders/:orderNumber
router.get('/:orderNumber', (req, res) => {
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.orderNumber);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const items = db.prepare('SELECT oi.*, b.cover_image, b.slug FROM order_items oi JOIN books b ON oi.book_id = b.id WHERE oi.order_id = ?').all(order.id);
  order.items = items;
  res.json(order);
});

// GET /api/orders — user's orders (requires auth)
router.get('/', (req, res) => {
  const db = getDb();
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Authentication required' });

  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  res.json(orders);
});

module.exports = router;
