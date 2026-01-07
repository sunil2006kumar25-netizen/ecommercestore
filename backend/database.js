const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'shopsi.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      discount_price REAL,
      stock INTEGER DEFAULT 0,
      image_url TEXT,
      category TEXT,
      rating REAL DEFAULT 4.5,
      reviews_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT DEFAULT 'online',
      payment_status TEXT DEFAULT 'pending',
      shipping_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order items table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Wishlist table
  db.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Insert sample products if table is empty
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (row && row.count === 0) {
      const sampleProducts = [
        // Electronics
        { name: 'Laptop Pro', description: 'High-performance laptop with 16GB RAM, 512GB SSD', price: 1299.99, discount_price: 999.99, stock: 10, category: 'Electronics', rating: 4.8, reviews_count: 156 },
        { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with precision tracking', price: 29.99, discount_price: 19.99, stock: 50, category: 'Electronics', rating: 4.5, reviews_count: 89 },
        { name: 'USB-C Cable', description: '6ft fast charging USB-C cable', price: 12.99, stock: 100, category: 'Electronics', rating: 4.3, reviews_count: 45 },
        { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with cherry switches', price: 89.99, discount_price: 69.99, stock: 25, category: 'Electronics', rating: 4.7, reviews_count: 123 },
        { name: 'Monitor 4K', description: '27" 4K UHD Monitor with HDR support', price: 399.99, discount_price: 349.99, stock: 15, category: 'Electronics', rating: 4.6, reviews_count: 78 },
        { name: 'Webcam HD', description: '1080p HD webcam with built-in microphone', price: 59.99, discount_price: 39.99, stock: 30, category: 'Electronics', rating: 4.4, reviews_count: 67 },
        // Fashion
        { name: 'Cotton T-Shirt', description: 'Comfortable 100% cotton t-shirt, multiple colors', price: 24.99, discount_price: 14.99, stock: 80, category: 'Fashion', rating: 4.5, reviews_count: 112 },
        { name: 'Denim Jeans', description: 'Classic blue denim jeans, all sizes available', price: 49.99, discount_price: 39.99, stock: 60, category: 'Fashion', rating: 4.6, reviews_count: 95 },
        { name: 'Casual Sneakers', description: 'Comfortable running sneakers with cushioning', price: 79.99, discount_price: 59.99, stock: 45, category: 'Fashion', rating: 4.7, reviews_count: 134 },
        // Books
        { name: 'JavaScript Mastery', description: 'Complete guide to JavaScript programming', price: 39.99, discount_price: 29.99, stock: 40, category: 'Books', rating: 4.8, reviews_count: 203 },
        { name: 'Web Design Guide', description: 'Modern web design principles and practices', price: 44.99, stock: 35, category: 'Books', rating: 4.5, reviews_count: 87 },
        // Home & Kitchen
        { name: 'Coffee Maker', description: 'Programmable coffee maker with thermal carafe', price: 79.99, discount_price: 59.99, stock: 22, category: 'Home & Kitchen', rating: 4.6, reviews_count: 108 },
        { name: 'Stainless Steel Cookware', description: '10-piece cookware set with lids', price: 149.99, discount_price: 99.99, stock: 18, category: 'Home & Kitchen', rating: 4.7, reviews_count: 142 },
        { name: 'Non-Stick Frying Pan', description: 'Premium non-stick frying pan 12 inch', price: 34.99, discount_price: 24.99, stock: 55, category: 'Home & Kitchen', rating: 4.4, reviews_count: 76 },
        // Sports
        { name: 'Yoga Mat', description: 'Premium yoga mat with non-slip surface', price: 29.99, discount_price: 19.99, stock: 65, category: 'Sports', rating: 4.5, reviews_count: 98 },
        { name: 'Dumbbells Set', description: 'Adjustable dumbbells set 5-25 lbs', price: 199.99, discount_price: 149.99, stock: 12, category: 'Sports', rating: 4.8, reviews_count: 167 },
        { name: 'Water Bottle', description: 'Insulated stainless steel water bottle 32oz', price: 24.99, discount_price: 16.99, stock: 90, category: 'Sports', rating: 4.6, reviews_count: 134 }
      ];

      sampleProducts.forEach(product => {
        db.run(
          'INSERT INTO products (name, description, price, discount_price, stock, category, rating, reviews_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.discount_price || product.price, product.stock, product.category, product.rating, product.reviews_count],
          (err) => {
            if (err) console.error('Error inserting sample product:', err);
          }
        );
      });
    }
  });
}

// Promisify database operations
const dbAll = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbRun = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = { db, dbAll, dbGet, dbRun };
