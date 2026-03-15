const express = require('express');
const { getDb } = require('../database');
const router = express.Router();

// GET /api/books — list all books with optional filters
router.get('/', (req, res) => {
  const db = getDb();
  const { category, series, edition, status, search, sort } = req.query;

  let query = 'SELECT b.*, c.name as category_name, c.slug as category_slug FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND c.slug = ?';
    params.push(category);
  }
  if (series) {
    query += ' AND b.series = ?';
    params.push(series);
  }
  if (edition) {
    query += ' AND b.edition_type = ?';
    params.push(edition);
  }
  if (status) {
    query += ' AND b.status = ?';
    params.push(status);
  }
  if (search) {
    query += ' AND (b.title LIKE ? OR b.subtitle LIKE ? OR b.description LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  switch (sort) {
    case 'price-asc': query += ' ORDER BY b.price ASC'; break;
    case 'price-desc': query += ' ORDER BY b.price DESC'; break;
    case 'newest': query += ' ORDER BY b.created_at DESC'; break;
    case 'title': query += ' ORDER BY b.title ASC'; break;
    default: query += ' ORDER BY b.sort_order ASC';
  }

  const books = db.prepare(query).all(...params);
  books.forEach(b => { b.detail_images = JSON.parse(b.detail_images || '[]'); });
  res.json(books);
});

// GET /api/books/featured
router.get('/featured', (req, res) => {
  const db = getDb();
  const books = db.prepare('SELECT b.*, c.name as category_name FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.featured = 1 ORDER BY b.sort_order').all();
  books.forEach(b => { b.detail_images = JSON.parse(b.detail_images || '[]'); });
  res.json(books);
});

// GET /api/books/:slug
router.get('/:slug', (req, res) => {
  const db = getDb();
  const book = db.prepare('SELECT b.*, c.name as category_name, c.slug as category_slug FROM books b LEFT JOIN categories c ON b.category_id = c.id WHERE b.slug = ?').get(req.params.slug);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  book.detail_images = JSON.parse(book.detail_images || '[]');
  res.json(book);
});

module.exports = router;
