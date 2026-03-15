const express = require('express');
const { getDb } = require('../database');
const router = express.Router();

// GET /api/cart?session_id=xxx
router.get('/', (req, res) => {
  const db = getDb();
  const { session_id } = req.query;
  const userId = req.user?.id;

  let items;
  if (userId) {
    items = db.prepare(`
      SELECT ci.id, ci.quantity, b.id as book_id, b.title, b.subtitle, b.slug, b.price, b.currency, b.cover_image, b.status
      FROM cart_items ci JOIN books b ON ci.book_id = b.id
      WHERE ci.user_id = ?
    `).all(userId);
  } else if (session_id) {
    items = db.prepare(`
      SELECT ci.id, ci.quantity, b.id as book_id, b.title, b.subtitle, b.slug, b.price, b.currency, b.cover_image, b.status
      FROM cart_items ci JOIN books b ON ci.book_id = b.id
      WHERE ci.session_id = ?
    `).all(session_id);
  } else {
    return res.json({ items: [], subtotal: 0 });
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.json({ items, subtotal, count: items.reduce((s, i) => s + i.quantity, 0) });
});

// POST /api/cart
router.post('/', (req, res) => {
  const db = getDb();
  const { session_id, book_id, quantity = 1 } = req.body;
  const userId = req.user?.id;

  if (!book_id) return res.status(400).json({ error: 'book_id is required' });

  const book = db.prepare('SELECT id, status FROM books WHERE id = ?').get(book_id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (book.status === 'out_of_stock') return res.status(400).json({ error: 'Book is out of stock' });

  // Check if already in cart
  let existing;
  if (userId) {
    existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND book_id = ?').get(userId, book_id);
  } else {
    existing = db.prepare('SELECT id, quantity FROM cart_items WHERE session_id = ? AND book_id = ?').get(session_id, book_id);
  }

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(existing.quantity + quantity, existing.id);
  } else {
    db.prepare('INSERT INTO cart_items (session_id, user_id, book_id, quantity) VALUES (?, ?, ?, ?)').run(
      userId ? null : session_id, userId || null, book_id, quantity
    );
  }

  res.json({ success: true, message: 'Added to cart' });
});

// PUT /api/cart/:id
router.put('/:id', (req, res) => {
  const db = getDb();
  const { quantity } = req.body;
  if (quantity < 1) {
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);
  } else {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
  }
  res.json({ success: true });
});

// DELETE /api/cart/:id
router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM cart_items WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// POST /api/cart/merge — merge guest cart into user cart after login
router.post('/merge', (req, res) => {
  const db = getDb();
  const { session_id } = req.body;
  const userId = req.user?.id;
  if (!userId || !session_id) return res.status(400).json({ error: 'Missing data' });

  const guestItems = db.prepare('SELECT * FROM cart_items WHERE session_id = ?').all(session_id);
  for (const item of guestItems) {
    const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND book_id = ?').get(userId, item.book_id);
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(existing.quantity + item.quantity, existing.id);
    } else {
      db.prepare('UPDATE cart_items SET user_id = ?, session_id = NULL WHERE id = ?').run(userId, item.id);
    }
  }
  db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(session_id);
  res.json({ success: true });
});

module.exports = router;
