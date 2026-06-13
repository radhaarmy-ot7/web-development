import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db = null

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './ecommerce.db',
      driver: sqlite3.Database
    })
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        items TEXT NOT NULL,
        total REAL NOT NULL,
        customer_name TEXT,
        customer_email TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Seed sample data if empty
    const count = await db.get('SELECT COUNT(*) as count FROM products')
    if (count.count === 0) {
      const sampleProducts = [
        ['Minimalist Leather Tote Bag', 189.00, 'Accessories', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop', 'Handcrafted full-grain leather tote with clean lines and magnetic closure.'],
        ['Premium Cotton Crew Neck', 79.00, 'Apparel', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop', 'Heavyweight 280gsm organic cotton with reinforced collar.'],
        ['Ceramic Pour-Over Set', 65.00, 'Home', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&h=750&fit=crop', 'Matte black ceramic dripper with matching carafe and filters.'],
        ['Merino Wool Beanie', 45.00, 'Accessories', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=750&fit=crop', 'Ultra-fine merino wool, ribbed knit, one size fits all.'],
        ['Minimalist Desk Lamp', 149.00, 'Home', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=750&fit=crop', 'Adjustable LED lamp with touch dimmer and matte black finish.'],
        ['Structured Wool Overcoat', 349.00, 'Apparel', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=750&fit=crop', 'Double-breasted Italian wool blend with peak lapels.'],
        ['Leather Card Holder', 39.00, 'Accessories', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=750&fit=crop', 'Slim profile vegetable-tanned leather, 6 card slots.'],
        ['Minimalist Wall Clock', 89.00, 'Home', 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&h=750&fit=crop', 'Silent sweep movement, matte black aluminum frame.']
      ]
      
      const stmt = await db.prepare('INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)')
      for (const product of sampleProducts) {
        await stmt.run(product)
      }
      await stmt.finalize()
    }
  }
  return db
}