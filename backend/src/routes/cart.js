import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import db from '../database/db.js';

const cart = new Hono();

cart.use('*', authMiddleware);

const getCartItems = async (userId, lang) => {
  const rows = await db.allAsync(`
    SELECT c.productId, c.quantity, p.name, p.name_ru, p.name_en, p.price, p.image, p.categoryId, cat.slug as category
    FROM cart c
    JOIN products p ON c.productId = p.id
    LEFT JOIN categories cat ON p.categoryId = cat.id
    WHERE c.userId = ?
  `, [userId]);
  
  const items = (rows || []).map(row => {
    const name = lang === 'en' && row.name_en ? row.name_en : row.name_ru || row.name;
    return { ...row, name };
  });
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { items, total };
};

cart.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const lang = c.req.query('lang') || 'ru';
    return c.json(await getCartItems(userId, lang));
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

cart.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    const { productId, quantity = 1 } = await c.req.json();

    const product = await db.getAsync('SELECT id FROM products WHERE id = ?', [productId]);
    if (!product) {
      return c.json({ error: 'Товар не найден' }, 404);
    }

    const existing = await db.getAsync(
      'SELECT * FROM cart WHERE userId = ? AND productId = ?',
      [userId, productId]
    );

    if (existing) {
      await db.runAsync(
        'UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?',
        [quantity, userId, productId]
      );
    } else {
      await db.runAsync(
        'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    const lang = c.req.query('lang') || 'ru';
    return c.json(await getCartItems(userId, lang));
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

cart.put('/:productId', async (c) => {
  try {
    const userId = c.get('userId');
    const productId = parseInt(c.req.param('productId'));
    const { quantity } = await c.req.json();

    if (quantity <= 0) {
      await db.runAsync(
        'DELETE FROM cart WHERE userId = ? AND productId = ?',
        [userId, productId]
      );
    } else {
      await db.runAsync(
        'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?',
        [quantity, userId, productId]
      );
    }

    const lang = c.req.query('lang') || 'ru';
    return c.json(await getCartItems(userId, lang));
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

cart.delete('/:productId', async (c) => {
  try {
    const userId = c.get('userId');
    const productId = parseInt(c.req.param('productId'));

    await db.runAsync(
      'DELETE FROM cart WHERE userId = ? AND productId = ?',
      [userId, productId]
    );

    const lang = c.req.query('lang') || 'ru';
    return c.json(await getCartItems(userId, lang));
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

cart.delete('/', async (c) => {
  try {
    const userId = c.get('userId');
    await db.runAsync('DELETE FROM cart WHERE userId = ?', [userId]);
    return c.json({ items: [], total: 0 });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default cart;
