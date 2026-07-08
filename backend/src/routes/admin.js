import { Hono } from 'hono';
import { adminMiddleware } from '../middleware/admin.js';
import db from '../database/db.js';

const admin = new Hono();

admin.use('*', adminMiddleware);

admin.get('/users', (c) => {
  return new Promise((resolve) => {
    const excludeAdmins = c.req.query('excludeAdmins') === 'true';
    
    const query = excludeAdmins
      ? 'SELECT id, email, role, createdAt FROM users WHERE role != ? ORDER BY createdAt DESC'
      : 'SELECT id, email, role, createdAt FROM users ORDER BY createdAt DESC';
    
    const params = excludeAdmins ? ['admin'] : [];
    
    db.all(query, params, (err, users) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      resolve(c.json(users));
    });
  });
});

admin.get('/orders', (c) => {
  return new Promise((resolve) => {
    db.all(
      `SELECT o.id, o.userId, o.total, o.status, o.fullName, o.phone, o.email, o.createdAt,
              u.email as userEmail, u.role as userRole,
              oi.productId, oi.quantity, oi.price,
              p.name as productName, p.image as productImage
       FROM orders o
       LEFT JOIN users u ON o.userId = u.id
       LEFT JOIN order_items oi ON o.id = oi.orderId
       LEFT JOIN products p ON oi.productId = p.id
       ORDER BY o.createdAt DESC`,
      [],
      (err, rows) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }

        if (rows.length === 0) {
          return resolve(c.json([]));
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

        resolve(c.json(Object.values(ordersMap)));
      }
    );
  });
});

admin.get('/users/:userId/orders', (c) => {
  return new Promise((resolve) => {
    const userId = parseInt(c.req.param('userId'));

    db.all(
      `SELECT o.id, o.userId, o.total, o.status, o.fullName, o.phone, o.email, o.createdAt,
              oi.productId, oi.quantity, oi.price,
              p.name as productName, p.image as productImage
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderId
       LEFT JOIN products p ON oi.productId = p.id
       WHERE o.userId = ?
       ORDER BY o.createdAt DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }

        if (rows.length === 0) {
          return resolve(c.json([]));
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

        resolve(c.json(Object.values(ordersMap)));
      }
    );
  });
});

admin.get('/stats', (c) => {
  return new Promise((resolve) => {
    const stats = {};

    db.get(
      'SELECT COUNT(*) as count FROM users WHERE role != ?', 
      ['admin'], 
      (err, row) => {
      if (err) return resolve(c.json({ error: err.message }, 500));
      stats.totalUsers = row.count;

      db.get(
        `SELECT COUNT(*) as count 
         FROM orders o
         JOIN users u ON o.userId = u.id
         WHERE u.role != ?`, 
        ['admin'],
        (err, row) => {
        if (err) return resolve(c.json({ error: err.message }, 500));
        stats.totalOrders = row.count;

        db.get(
          `SELECT SUM(o.total) as total 
           FROM orders o
           JOIN users u ON o.userId = u.id
           WHERE u.role != ?`, 
          ['admin'],
          (err, row) => {
          if (err) return resolve(c.json({ error: err.message }, 500));
          stats.totalRevenue = row.total || 0;

          resolve(c.json(stats));
        });
      });
    });
  });
});

export default admin;