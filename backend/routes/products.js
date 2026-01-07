const express = require('express');
const router = express.Router();
const { dbAll, dbGet } = require('../database');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await dbAll('SELECT * FROM products', []);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await dbGet('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await dbAll('SELECT * FROM products WHERE category = ?', [req.params.category]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
