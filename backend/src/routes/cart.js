import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import db from '../database/db.js';

const cart = new Hono();

cart.use('*', authMiddleware);

cart.get('/', (c) => {
  return new Promise((resolve) => {
    const userId = c.get('userId');
    
    db.all(`
      SELECT c.productId, c.quantity, p.name, p.price, p.image, p.category
      FROM cart c
      JOIN products p ON c.productId = p.id
      WHERE c.userId = ?
    `, [userId], (err, rows) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      const items = rows || [];
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      resolve(c.json({ items, total }));
    });
  });
});

cart.post('/', (c) => {
  return new Promise(async (resolve) => {
    const userId = c.get('userId');
    const { productId, quantity = 1 } = await c.req.json();

    db.get('SELECT id FROM products WHERE id = ?', [productId], (err, product) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      if (!product) {
        return resolve(c.json({ error: 'Товар не найден' }, 404));
      }

      db.get(
        'SELECT * FROM cart WHERE userId = ? AND productId = ?',
        [userId, productId],
        (err, row) => {
          if (err) {
            return resolve(c.json({ error: err.message }, 500));
          }

          if (row) {
            db.run(
              'UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?',
              [quantity, userId, productId],
              (err) => {
                if (err) {
                  return resolve(c.json({ error: err.message }, 500));
                }
                getCartItems(userId, resolve, c);
              }
            );
          } else {
            db.run(
              'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
              [userId, productId, quantity],
              (err) => {
                if (err) {
                  return resolve(c.json({ error: err.message }, 500));
                }
                getCartItems(userId, resolve, c);
              }
            );
          }
        }
      );
    });
  });
});

cart.put('/:productId', (c) => {
  return new Promise(async (resolve) => {
    const userId = c.get('userId');
    const productId = parseInt(c.req.param('productId'));
    const { quantity } = await c.req.json();

    if (quantity <= 0) {
      db.run(
        'DELETE FROM cart WHERE userId = ? AND productId = ?',
        [userId, productId],
        (err) => {
          if (err) {
            return resolve(c.json({ error: err.message }, 500));
          }
          getCartItems(userId, resolve, c);
        }
      );
    } else {
      db.run(
        'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?',
        [quantity, userId, productId],
        (err) => {
          if (err) {
            return resolve(c.json({ error: err.message }, 500));
          }
          getCartItems(userId, resolve, c);
        }
      );
    }
  });
});

cart.delete('/:productId', (c) => {
  return new Promise((resolve) => {
    const userId = c.get('userId');
    const productId = parseInt(c.req.param('productId'));

    db.run(
      'DELETE FROM cart WHERE userId = ? AND productId = ?',
      [userId, productId],
      (err) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }
        getCartItems(userId, resolve, c);
      }
    );
  });
});

cart.delete('/', (c) => {
  return new Promise((resolve) => {
    const userId = c.get('userId');

    db.run('DELETE FROM cart WHERE userId = ?', [userId], (err) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      resolve(c.json({ items: [], total: 0 }));
    });
  });
});

const getCartItems = (userId, resolve, c) => {
  db.all(`
    SELECT c.productId, c.quantity, p.name, p.price, p.image, p.category
    FROM cart c
    JOIN products p ON c.productId = p.id
    WHERE c.userId = ?
  `, [userId], (err, rows) => {
    if (err) {
      return resolve(c.json({ error: err.message }, 500));
    }
    const items = rows || [];
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    resolve(c.json({ items, total }));
  });
};

export default cart;