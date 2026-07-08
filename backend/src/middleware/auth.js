import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'skam-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Не авторизован' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    c.set('userId', decoded.userId);
    await next();
  } catch (err) {
    return c.json({ error: 'Неверный токен' }, 401);
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export { JWT_SECRET };
