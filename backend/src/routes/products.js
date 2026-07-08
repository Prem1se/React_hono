import { Hono } from 'hono';
import db from '../database/db.js';
import { adminMiddleware } from '../middleware/admin.js';

const productsRouter = new Hono();

productsRouter.post('/', adminMiddleware, (c) => {
  return new Promise(async (resolve) => {
    try {
      const { name, price, category, description, image, stock } = await c.req.json();

      if (!name || !price || !category) {
        return resolve(c.json({ error: 'name, price и category обязательны' }, 400));
      }

      db.run(
        `INSERT INTO products (name, price, category, description, image, stock)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, parseFloat(price), category, description || '', image || '', stock || 0],
        function(err) {
          if (err) {
            return resolve(c.json({ error: err.message }, 500));
          }
          
          db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, product) => {
            if (err) {
              return resolve(c.json({ error: err.message }, 500));
            }
            resolve(c.json(product, 201));
          });
        }
      );
    } catch (error) {
      resolve(c.json({ error: error.message }, 500));
    }
  });
});

productsRouter.put('/:id', adminMiddleware, (c) => {
  return new Promise(async (resolve) => {
    try {
      const id = parseInt(c.req.param('id'));
      const { name, price, category, description, image, stock } = await c.req.json();

      if (!name || !price || !category) {
        return resolve(c.json({ error: 'name, price и category обязательны' }, 400));
      }

      db.run(
        `UPDATE products 
         SET name = ?, price = ?, category = ?, description = ?, image = ?, stock = ?
         WHERE id = ?`,
        [name, parseFloat(price), category, description || '', image || '', stock || 0, id],
        function(err) {
          if (err) {
            return resolve(c.json({ error: err.message }, 500));
          }
          
          if (this.changes === 0) {
            return resolve(c.json({ error: 'Товар не найден' }, 404));
          }
          
          db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
            if (err) {
              return resolve(c.json({ error: err.message }, 500));
            }
            resolve(c.json(product));
          });
        }
      );
    } catch (error) {
      resolve(c.json({ error: error.message }, 500));
    }
  });
});

productsRouter.delete('/:id', adminMiddleware, (c) => {
  return new Promise((resolve) => {
    const id = parseInt(c.req.param('id'));

    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      
      if (this.changes === 0) {
        return resolve(c.json({ error: 'Товар не найден' }, 404));
      }
      
      resolve(c.json({ message: 'Товар удалён' }));
    });
  });
});

// ===== PUBLIC ROUTES =====
productsRouter.get('/categories/list', (c) => {
  return new Promise((resolve) => {
    db.all('SELECT DISTINCT category FROM products', [], (err, rows) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      resolve(c.json(rows.map(r => r.category)));
    });
  });
});

productsRouter.get('/popular', (c) => {
  return new Promise((resolve) => {
    db.all('SELECT * FROM products LIMIT 6', [], (err, rows) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      resolve(c.json(rows));
    });
  });
});

productsRouter.get('/search', (c) => {
  const query = c.req.query('q');
  
  if (!query || query.length < 2) {
    return c.json([]);
  }
  
  return new Promise((resolve) => {
    db.all(
      'SELECT * FROM products WHERE name LIKE ? OR category LIKE ? OR description LIKE ? LIMIT 20',
      [`%${query}%`, `%${query}%`, `%${query}%`],
      (err, rows) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }
        resolve(c.json(rows));
      }
    );
  });
});

productsRouter.get('/category/:category', (c) => {
  const category = c.req.param('category');
  
  return new Promise((resolve) => {
    db.all('SELECT * FROM products WHERE category = ?', [category], (err, rows) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      resolve(c.json(rows));
    });
  });
});

productsRouter.get('/', (c) => {
  return new Promise((resolve) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      resolve(c.json(rows));
    });
  });
});

productsRouter.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  
  return new Promise((resolve) => {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      if (!row) {
        return resolve(c.json({ error: 'Товар не найден' }, 404));
      }
      resolve(c.json(row));
    });
  });
});

export default productsRouter;