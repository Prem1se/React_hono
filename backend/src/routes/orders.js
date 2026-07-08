import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import db from '../database/db.js';

const ordersRouter = new Hono();

ordersRouter.use('*', authMiddleware);

ordersRouter.post('/', (c) => {
  return new Promise(async (resolve) => {
    const userId = c.get('userId');
    
    let body;
    try {
      body = await c.req.json();
    } catch (err) {
      return resolve(c.json({ error: 'Некорректный JSON' }, 400));
    }
    
    const { customerInfo, items, total } = body;
    
    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.email) {
      return resolve(c.json({ error: 'Неверные данные заказа' }, 400));
    }

    db.all(
      'SELECT * FROM cart WHERE userId = ?',
      [userId],
      (err, cartItems) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }

        if (cartItems.length === 0) {
          return resolve(c.json({ error: 'Корзина пуста' }, 400));
        }

        const productIds = cartItems.map(item => item.productId);
        const placeholders = productIds.map(() => '?').join(',');
        
        db.all(
          `SELECT * FROM products WHERE id IN (${placeholders})`,
          productIds,
          (err, products) => {
            if (err) {
              return resolve(c.json({ error: err.message }, 500));
            }

            for (const item of cartItems) {
              const product = products.find(p => p.id === item.productId);
              if (!product) {
                return resolve(c.json({ error: `Товар ${item.productId} не найден` }, 400));
              }
              if (product.stock < item.quantity) {
                return resolve(c.json({ error: `Недостаточно товара "${product.name}" на складе` }, 400));
              }
            }

            const calculatedTotal = cartItems.reduce((sum, item) => {
              const product = products.find(p => p.id === item.productId);
              return sum + (product.price * item.quantity);
            }, 0);

            db.serialize(() => {
              db.run('BEGIN TRANSACTION');

              db.run(
                `INSERT INTO orders (userId, total, fullName, phone, email) VALUES (?, ?, ?, ?, ?)`,
                [userId, calculatedTotal, customerInfo.fullName, customerInfo.phone, customerInfo.email],
                function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    return resolve(c.json({ error: err.message }, 500));
                  }

                  const orderId = this.lastID;
                  let completed = 0;
                  let hasError = false;

                  cartItems.forEach(item => {
                    const product = products.find(p => p.id === item.productId);

                    db.run(
                      'INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
                      [orderId, item.productId, item.quantity, product.price],
                      (err) => {
                        if (err) {
                          if (!hasError) {
                            hasError = true;
                            db.run('ROLLBACK');
                            return resolve(c.json({ error: err.message }, 500));
                          }
                          return;
                        }

                        db.run(
                          'UPDATE products SET stock = stock - ? WHERE id = ?',
                          [item.quantity, item.productId],
                          (err) => {
                            if (err && !hasError) {
                              hasError = true;
                              db.run('ROLLBACK');
                              return resolve(c.json({ error: err.message }, 500));
                            }

                            completed++;
                            if (completed === cartItems.length && !hasError) {
                              db.run('DELETE FROM cart WHERE userId = ?', [userId], (err) => {
                                if (err) {
                                  db.run('ROLLBACK');
                                  return resolve(c.json({ error: err.message }, 500));
                                }

                                db.run('COMMIT');

                                db.get(
                                  `SELECT o.*, 
                                   GROUP_CONCAT(oi.productId || ':' || oi.quantity) as items
                                   FROM orders o
                                   LEFT JOIN order_items oi ON o.id = oi.orderId
                                   WHERE o.id = ?
                                   GROUP BY o.id`,
                                  [orderId],
                                  (err, order) => {
                                    if (err) {
                                      return resolve(c.json({ error: err.message }, 500));
                                    }

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

                                    resolve(c.json({
                                      ...order,
                                      items: orderItems,
                                      createdAt: new Date(order.createdAt).toISOString()
                                    }, 201));
                                  }
                                );
                              });
                            }
                          }
                        );
                      }
                    );
                  });
                }
              );
            });
          }
        );
      }
    );
  });
});

ordersRouter.get('/', (c) => {
  return new Promise((resolve) => {
    const userId = c.get('userId');

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

ordersRouter.get('/:id', (c) => {
  return new Promise((resolve) => {
    const userId = c.get('userId');
    const orderId = parseInt(c.req.param('id'));

    db.all(
      `SELECT o.id, o.userId, o.total, o.status, o.fullName, o.phone, o.email, o.createdAt,
              oi.productId, oi.quantity, oi.price,
              p.name as productName, p.image as productImage
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.orderId
       LEFT JOIN products p ON oi.productId = p.id
       WHERE o.id = ? AND o.userId = ?`,
      [orderId, userId],
      (err, rows) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }

        if (rows.length === 0) {
          return resolve(c.json({ error: 'Заказ не найден' }, 404));
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

        resolve(c.json(order));
      }
    );
  });
});

export default ordersRouter;