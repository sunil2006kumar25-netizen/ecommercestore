const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { dbGet, dbRun, dbAll } = require('../database');

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    for (const item of items) {
      const product = await dbGet('SELECT * FROM products WHERE id = ?', [item.productId]);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
    }

    // Create order
    const orderResult = await dbRun(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, totalAmount, 'completed']
    );

    // Add order items
    for (const item of items) {
      const product = await dbGet('SELECT price FROM products WHERE id = ?', [item.productId]);
      await dbRun(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderResult.id, item.productId, item.quantity, product.price]
      );

      // Update product stock
      await dbRun(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    res.status(201).json({ message: 'Order created successfully', orderId: orderResult.id, totalAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await dbAll(
      `SELECT o.*, COUNT(oi.id) as itemCount 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ? 
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await dbGet(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await dbAll(
      'SELECT oi.*, p.name, p.description FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
      [req.params.id]
    );

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
