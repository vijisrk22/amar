const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Optional auth extraction (non-blocking — sets req.user if token present)
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./routes/auth');
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    } catch (e) { /* ignore invalid tokens */ }
  }
  next();
});

// API routes
app.use('/api/books', require('./routes/books'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api', require('./routes/content'));

// Serve Angular app in production
const angularDist = path.join(__dirname, 'public', 'browser');
app.use(express.static(angularDist));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(angularDist, 'index.html'));
});

// Initialize DB & auto-seed if empty
const db = getDb();
const bookCount = db.prepare('SELECT COUNT(*) as count FROM books').get();
if (bookCount.count === 0) {
  console.log('📦 Database is empty — running seed...');
  require('./seed');
}

const fs = require('fs');
const assetsDir = path.join(__dirname, 'public', 'assets');
console.log(`📁 Assets directory: ${assetsDir} (exists: ${fs.existsSync(assetsDir)})`);

app.listen(PORT, () => {
  console.log(`🚀 Amar Books API running on http://localhost:${PORT}`);
});
