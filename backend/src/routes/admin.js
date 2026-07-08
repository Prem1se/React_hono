import { Hono } from 'hono';
import { adminMiddleware } from '../middleware/admin.js';
import db from '../database/db.js';

const admin = new Hono();


function groupOrders(rows) {
  if (!rows || rows.length === 0) return [];

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
        userEmail: row.userEmail,
        userRole: row.userRole,
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

  return Object.values(ordersMap);
}


admin.get('/users', async (c) => {
  try {
    const excludeAdmins = c.req.query('excludeAdmins') === 'true';

    const query = excludeAdmins
      ? 'SELECT id, email, role, createdAt FROM users WHERE role != ? ORDER BY createdAt DESC'
      : 'SELECT id, email, role, createdAt FROM users ORDER BY createdAt DESC';

    const params = excludeAdmins ? ['admin'] : [];

    const users = await db.allAsync(query, params);
    return c.json(users);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

admin.get('/orders', async (c) => {
  try {
    const rows = await db.allAsync(`
      SELECT o.id, o.userId, o.total, o.status, o.fullName, o.phone, o.email, o.createdAt,
             u.email as userEmail, u.role as userRole,
             oi.productId, oi.quantity, oi.price,
             p.name as productName, p.image as productImage
      FROM orders o
      LEFT JOIN users u ON o.userId = u.id
      LEFT JOIN order_items oi ON o.id = oi.orderId
      LEFT JOIN products p ON oi.productId = p.id
      ORDER BY o.createdAt DESC
    `);

    return c.json(groupOrders(rows));
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});


admin.get('/users/:userId/orders', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));

    if (isNaN(userId)) {
      return c.json({ error: 'Invalid userId' }, 400);
    }

    const rows = await db.allAsync(`
      SELECT o.id, o.userId, o.total, o.status, o.fullName, o.phone, o.email, o.createdAt,
             oi.productId, oi.quantity, oi.price,
             p.name as productName, p.image as productImage
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.orderId
      LEFT JOIN products p ON oi.productId = p.id
      WHERE o.userId = ?
      ORDER BY o.createdAt DESC
    `, [userId]);

    return c.json(groupOrders(rows));
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

admin.get('/stats', async (c) => {
  try {
    const [usersRow, ordersRow, revenueRow] = await Promise.all([
      db.getAsync(
        'SELECT COUNT(*) as count FROM users WHERE role != ?',
        ['admin']
      ),
      db.getAsync(
        `SELECT COUNT(*) as count 
         FROM orders o
         JOIN users u ON o.userId = u.id
         WHERE u.role != ?`,
        ['admin']
      ),
      db.getAsync(
        `SELECT SUM(o.total) as total 
         FROM orders o
         JOIN users u ON o.userId = u.id
         WHERE u.role != ?`,
        ['admin']
      )
    ]);

    return c.json({
      totalUsers: usersRow?.count || 0,
      totalOrders: ordersRow?.count || 0,
      totalRevenue: revenueRow?.total || 0
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default admin;