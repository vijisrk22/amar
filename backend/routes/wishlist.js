const express = require('express');
const { getDb } = require('../database');
const { authenticate } = require('./auth');
const router = express.Router();

// GET /api/wishlist
router.get('/', authenticate, (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT w.id, w.created_at, b.id as book_id, b.title, b.subtitle, b.slug, b.price, b.currency, b.cover_image, b.status
    FROM wishlist w JOIN books b ON w.book_id = b.id
    WHERE w.user_id = ? ORDER BY w.created_at DESC
  `).all(req.user.id);
  res.json(items);
});

// POST /api/wishlist
router.post('/', authenticate, (req, res) => {
  const db = getDb();
  const { book_id } = req.body;
  if (!book_id) return res.status(400).json({ error: 'book_id required' });

  try {
    db.prepare('INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)').run(req.user.id, book_id);
    res.status(201).json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.json({ success: true, message: 'Already in wishlist' });
    }
    throw err;
  }
});

// DELETE /api/wishlist/:bookId
router.delete('/:bookId', authenticate, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM wishlist WHERE user_id = ? AND book_id = ?').run(req.user.id, req.params.bookId);
  res.json({ success: true });
});

module.exports = router;
