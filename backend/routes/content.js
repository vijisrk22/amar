const express = require('express');
const { getDb } = require('../database');
const router = express.Router();

// GET /api/hero
router.get('/hero', (req, res) => {
  const db = getDb();
  const slides = db.prepare('SELECT * FROM hero_slides ORDER BY sort_order').all();
  res.json(slides);
});

// GET /api/about
router.get('/about', (req, res) => {
  const db = getDb();
  const sections = db.prepare('SELECT * FROM about_sections ORDER BY sort_order').all();
  res.json(sections);
});

// GET /api/categories
router.get('/categories', (req, res) => {
  const db = getDb();
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order').all();
  res.json(categories);
});

// GET /api/settings
router.get('/settings', (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM site_settings').all();
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  res.json(settings);
});

// GET /api/search?q=
router.get('/search', (req, res) => {
  const db = getDb();
  const q = req.query.q;
  if (!q) return res.json([]);
  const s = `%${q}%`;
  const books = db.prepare('SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.title LIKE ? OR b.subtitle LIKE ? OR b.description LIKE ? ORDER BY b.sort_order').all(s, s, s);
  books.forEach(b => { b.detail_images = JSON.parse(b.detail_images || '[]'); });
  res.json(books);
});

module.exports = router;
