import { Hono } from 'hono';
import db from '../database/db.js';
import { adminMiddleware } from '../middleware/admin.js';

const productsRouter = new Hono();

productsRouter.post('/', adminMiddleware, async (c) => {
  try {
    const { name, price, category, description, image, stock } = await c.req.json();

    if (!name || !price || !category) {
      return c.json({ error: 'name, price и category обязательны' }, 400);
    }

    const result = await db.runAsync(
      'INSERT INTO products (name, price, category, description, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, parseFloat(price), category, description || '', image || '', stock || 0]
    );
    
    const product = await db.getAsync('SELECT * FROM products WHERE id = ?', [result.lastID]);
    return c.json(product, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.put('/:id', adminMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const { name, price, category, description, image, stock } = await c.req.json();

    if (!name || !price || !category) {
      return c.json({ error: 'name, price и category обязательны' }, 400);
    }

    await db.runAsync(
      'UPDATE products SET name = ?, price = ?, category = ?, description = ?, image = ?, stock = ? WHERE id = ?',
      [name, parseFloat(price), category, description || '', image || '', stock || 0, id]
    );
    
    const product = await db.getAsync('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return c.json({ error: 'Товар не найден' }, 404);
    }
    return c.json(product);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.delete('/:id', adminMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const result = await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return c.json({ error: 'Товар не найден' }, 404);
    }
    
    return c.json({ message: 'Товар удалён' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.get('/categories/list', async (c) => {
  try {
    const rows = await db.allAsync('SELECT DISTINCT category FROM products');
    return c.json(rows.map(r => r.category));
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.get('/popular', async (c) => {
  try {
    const rows = await db.allAsync(`
      SELECT p.*, COUNT(oi.id) as purchaseCount
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.productId
      GROUP BY p.id
      ORDER BY purchaseCount DESC
      LIMIT 4
    `);
    return c.json(rows);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.get('/search', async (c) => {
  const query = c.req.query('q');
  
  if (!query || query.length < 2) {
    return c.json([]);
  }
  
  try {
    const rows = await db.allAsync(
      'SELECT * FROM products WHERE name LIKE ? OR category LIKE ? OR description LIKE ? LIMIT 20',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return c.json(rows);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.get('/category/:category', async (c) => {
  const category = c.req.param('category');
  
  try {
    const rows = await db.allAsync('SELECT * FROM products WHERE category = ?', [category]);
    return c.json(rows);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.get('/', async (c) => {
  try {
    const rows = await db.allAsync('SELECT * FROM products');
    return c.json(rows);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

productsRouter.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  
  try {
    const product = await db.getAsync('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return c.json({ error: 'Товар не найден' }, 404);
    }
    return c.json(product);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default productsRouter;
