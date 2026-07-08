import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import db from '../database/db.js';

const ordersRouter = new Hono();

ordersRouter.use('*', authMiddleware);

ordersRouter.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    const { customerInfo, items, total } = await c.req.json();
    
    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.email) {
      return c.json({ error: 'Неверные данные заказа' }, 400);
    }

    const cartItems = await db.allAsync('SELECT * FROM cart WHERE userId = ?', [userId]);

    if (cartItems.length === 0) {
      return c.json({ error: 'Корзина пуста' }, 400);
    }

    const productIds = cartItems.map(item => item.productId);
    const placeholders = productIds.map(() => '?').join(',');
    
    const products = await db.allAsync(
      `SELECT * FROM products WHERE id IN (${placeholders})`,
      productIds
    );

    for (const item of cartItems) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return c.json({ error: `Товар ${item.productId} не найден` }, 400);
      }
      if (product.stock < item.quantity) {
        return c.json({ error: `Недостаточно товара "${product.name}" на складе` }, 400);
      }
    }

    const calculatedTotal = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product.price * item.quantity);
    }, 0);

    try {
      const result = await db.runAsync(
        'INSERT INTO orders (userId, total, fullName, phone, email) VALUES (?, ?, ?, ?, ?)',
        [userId, calculatedTotal, customerInfo.fullName, customerInfo.phone, customerInfo.email]
      );

      if (!result || !result.lastID) {
        return c.json({ error: 'Ошибка создания заказа' }, 500);
      }

      const orderId = result.lastID;

      for (const item of cartItems) {
        const product = products.find(p => p.id === item.productId);
        
        await db.runAsync(
          'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, product.price]
        );

        await db.runAsync(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }

      await db.runAsync('DELETE FROM cart WHERE userId = ?', [userId]);

      const order = await db.getAsync(
        `SELECT o.*, 
         GROUP_CONCAT(oi.productId || ':' || oi.quantity) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.orderId
         WHERE o.id = ?
         GROUP BY o.id`,
        [orderId]
      );

      const orderItems = order.items ? order.items.split(',').map(item => {
        const [productId, quantity] = item.split(':');
        const product = products.find(p => p.id === parseInt(productId));
        return {
          productId: parseInt(productId),
          quantity: parseInt(quantity),
          name: product.name,
          price: product.price,
          image: product.image
        };
      }) : [];

      return c.json({
        ...order,
        items: orderItems,
        createdAt: new Date(order.createdAt).toISOString()
      }, 201);
    } catch (err) {
      throw err;
    }
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

ordersRouter.get('/', async (c) => {
  try {
    const userId = c.get('userId');

    const rows = await db.allAsync(
      `SELECT o.id, o.userId, o.total, o.status, o.fullName, o.phone, o.email, o.createdAt,
              oi.productId, oi.quantity, oi.price,
              p.name as productName, p.image as productImage
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderId
       LEFT JOIN products p ON oi.productId = p.id
       WHERE o.userId = ?
       ORDER BY o.createdAt DESC`,
      [userId]
    );

    if (rows.length === 0) {
      return c.json([]);
    }

    const ordersMap = {};
    rows.forEach(row => {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          userId: row.userId,
          total: row.total,
          status: row.status,
          fullName: row.fullName,
          phone: row.phone,
          email: row.email,
          createdAt: new Date(row.createdAt).toISOString(),
          items: []
        };
      }
      if (row.productId) {
        ordersMap[row.id].items.push({
          productId: row.productId,
          quantity: row.quantity,
          price: row.price,
          name: row.productName,
          image: row.productImage
        });
      }
    });

    return c.json(Object.values(ordersMap));
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

ordersRouter.get('/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const orderId = parseInt(c.req.param('id'));

    const rows = await db.allAsync(
      `SELECT o.id, o.userId, o.total, o.status, o.fullName, o.phone, o.email, o.createdAt,
              oi.productId, oi.quantity, oi.price,
              p.name as productName, p.image as productImage
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderId
       LEFT JOIN products p ON oi.productId = p.id
       WHERE o.id = ? AND o.userId = ?`,
      [orderId, userId]
    );

    if (rows.length === 0) {
      return c.json({ error: 'Заказ не найден' }, 404);
    }

    const order = {
      id: rows[0].id,
      userId: rows[0].userId,
      total: rows[0].total,
      status: rows[0].status,
      fullName: rows[0].fullName,
      phone: rows[0].phone,
      email: rows[0].email,
      createdAt: new Date(rows[0].createdAt).toISOString(),
      items: []
    };

    rows.forEach(row => {
      if (row.productId) {
        order.items.push({
          productId: row.productId,
          quantity: row.quantity,
          price: row.price,
          name: row.productName,
          image: row.productImage
        });
      }
    });

    return c.json(order);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default ordersRouter;
