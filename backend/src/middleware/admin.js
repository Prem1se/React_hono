import jwt from 'jsonwebtoken';
import db from '../database/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skam-secret-key-change-in-production';

export const adminMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Не авторизован' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await db.getAsync(
      'SELECT role FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (!user || user.role !== 'admin') {
      return c.json({ error: 'Доступ запрещён' }, 403);
    }
    
    c.set('userId', decoded.userId);
    return next();
  } catch (err) {
    return c.json({ error: 'Неверный токен' }, 401);
  }
};
