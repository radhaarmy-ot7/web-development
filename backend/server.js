const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT,
    description TEXT,
    image TEXT,
    rating REAL,
    inStock INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Contacts table
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Wishlist table
  db.run(`CREATE TABLE IF NOT EXISTS wishlist (
    id TEXT PRIMARY KEY,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_price REAL NOT NULL,
    product_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Insert sample products if empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error(err);
      return;
    }
    if (row.count === 0) {
      const sampleProducts = [
        ["Minimalist Leather Tote", 289.00, "Accessories", "Handcrafted from full-grain Italian leather. Spacious interior with a zippered pocket and magnetic closure.", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", 4.8, 1],
        ["Ceramic Vase Set", 145.00, "Home", "Set of three matte ceramic vases in graduated sizes. Perfect for dried or fresh flowers.", "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800", 4.9, 1],
        ["Linen Oversized Shirt", 178.00, "Apparel", "Premium European linen with relaxed fit. Breathable and perfect for warm weather.", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800", 4.7, 1],
        ["Concrete Desk Lamp", 225.00, "Lighting", "Industrial concrete base with brass arm. Includes warm LED bulb. Dimmer switch included.", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800", 4.6, 1],
        ["Wool Throw Blanket", 195.00, "Home", "100% Merino wool in basketweave pattern. Soft, warm, and ethically sourced.", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", 4.9, 1],
        ["Steel Watch Minimal", 395.00, "Accessories", "Swiss movement in brushed steel case. Sapphire crystal and genuine leather strap.", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800", 4.8, 1],
        ["Oak Coffee Table", 650.00, "Furniture", "Solid white oak with natural oil finish. Minimalist design with hidden storage.", "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800", 4.7, 1],
        ["Cotton Canvas Backpack", 165.00, "Accessories", "Heavyweight cotton canvas with leather trim. Laptop sleeve and water bottle pocket.", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800", 4.5, 1]
      ];

      const insert = db.prepare("INSERT INTO products (name, price, category, description, image, rating, inStock) VALUES (?, ?, ?, ?, ?, ?, ?)");
      sampleProducts.forEach(product => insert.run(product));
      insert.finalize();
      console.log('Sample products inserted');
    }
  });
});

// ==================== API Routes ====================

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let query = "SELECT * FROM products";
  let params = [];
  
  if (category && category !== 'all') {
    query += " WHERE category = ?";
    params.push(category);
  }
  
  if (search) {
    query += params.length ? " AND name LIKE ?" : " WHERE name LIKE ?";
    params.push(`%${search}%`);
  }
  
  query += " ORDER BY created_at DESC";
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(row);
  });
});

// Get product categories
app.get('/api/categories', (req, res) => {
  db.all("SELECT DISTINCT category FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => row.category));
  });
});

// ==================== Contact Routes ====================

// Create contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const id = uuidv4();
  db.run(
    "INSERT INTO contacts (id, name, email, message) VALUES (?, ?, ?, ?)",
    [id, name, email, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, message: 'Message received successfully' });
    }
  );
});

// Get all contacts (admin only - for demo purposes)
app.get('/api/contacts', (req, res) => {
  db.all("SELECT * FROM contacts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ==================== Order Routes ====================

// Create order
app.post('/api/orders', (req, res) => {
  const { items, total, customer_name, customer_email } = req.body;
  
  if (!items || !total) {
    return res.status(400).json({ error: 'Items and total are required' });
  }
  
  if (!customer_name || !customer_email) {
    return res.status(400).json({ error: 'Customer name and email are required' });
  }

  const id = uuidv4();
  db.run(
    "INSERT INTO orders (id, items, total, customer_name, customer_email, status) VALUES (?, ?, ?, ?, ?, ?)",
    [id, JSON.stringify(items), total, customer_name, customer_email, 'pending'],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, message: 'Order created successfully' });
    }
  );
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    // Parse items back to JSON
    row.items = JSON.parse(row.items);
    res.json(row);
  });
});

// ==================== Wishlist Routes ====================

// Get wishlist items
app.get('/api/wishlist', (req, res) => {
  db.all("SELECT * FROM wishlist ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add to wishlist
app.post('/api/wishlist', (req, res) => {
  const { product_id, product_name, product_price, product_image } = req.body;
  
  if (!product_id || !product_name || !product_price) {
    return res.status(400).json({ error: 'Product information is required' });
  }

  // Check if already in wishlist
  db.get("SELECT * FROM wishlist WHERE product_id = ?", [product_id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (row) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }
    
    const id = uuidv4();
    db.run(
      "INSERT INTO wishlist (id, product_id, product_name, product_price, product_image) VALUES (?, ?, ?, ?, ?)",
      [id, product_id, product_name, product_price, product_image || null],
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json({ id, message: 'Added to wishlist' });
      }
    );
  });
});

// Remove from wishlist
app.delete('/api/wishlist/:productId', (req, res) => {
  db.run("DELETE FROM wishlist WHERE product_id = ?", [req.params.productId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found in wishlist' });
      return;
    }
    res.json({ message: 'Removed from wishlist' });
  });
});

// Clear wishlist
app.delete('/api/wishlist', (req, res) => {
  db.run("DELETE FROM wishlist", [], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Wishlist cleared' });
  });
});

// ==================== Health Check ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: SQLite`);
  console.log(`📊 API endpoints available at /api/`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});