import jwt from 'jsonwebtoken';
import db from '../database/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skam-secret-key-change-in-production';

export const adminMiddleware = (c, next) => {
  return new Promise((resolve) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return resolve(c.json({ error: 'Не авторизован' }, 401));
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      db.get(
        'SELECT role FROM users WHERE id = ?',
        [decoded.userId],
        (err, user) => {
          if (err) {
            return resolve(c.json({ error: err.message }, 500));
          }
          
          if (!user || user.role !== 'admin') {
            return resolve(c.json({ error: 'Доступ запрещён' }, 403));
          }
          
          c.set('userId', decoded.userId);
          resolve(next());
        }
      );
    } catch (err) {
      resolve(c.json({ error: 'Неверный токен' }, 401));
    }
  });
};