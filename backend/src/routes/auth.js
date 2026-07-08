import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../database/db.js';
import { authMiddleware, generateToken } from '../middleware/auth.js';

const auth = new Hono();

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const generateResetCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const resetCodes = new Map();

auth.post('/register', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email и пароль обязательны' }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json({ error: 'Некорректный email' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Пароль должен быть не менее 6 символов' }, 400);
    }

    const existing = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);

    if (existing) {
      return c.json({ error: 'Пользователь с таким email уже существует' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.runAsync(
      'INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)',
      [email, passwordHash, 'user']
    );

    const token = generateToken(result.lastID);

    return c.json({
      token,
      user: { id: result.lastID, email, role: 'user' }
    }, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Вход
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email и пароль обязательны' }, 400);
    }

    if (!isValidEmail(email)) {
      return c.json({ error: 'Некорректный email' }, 400);
    }

    const user = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return c.json({ error: 'Пользователь не найден' }, 404);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return c.json({ error: 'Неверный пароль' }, 401);
    }

    const token = generateToken(user.id);

    return c.json({
      token,
      user: { 
        id: user.id, 
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.get('/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    
    const user = await db.getAsync('SELECT id, email, role FROM users WHERE id = ?', [userId]);
    
    if (!user) {
      return c.json({ error: 'Пользователь не найден' }, 404);
    }
    
    return c.json({
      id: user.id,
      email: user.email,
      role: user.role || 'user'
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.post('/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email || !isValidEmail(email)) {
      return c.json({ error: 'Некорректный email' }, 400);
    }

    const user = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);

    if (!user) {
      return c.json({ message: 'Если пользователь существует, код отправлен' });
    }

    const code = generateResetCode();
    const expires = Date.now() + 15 * 60 * 1000;

    resetCodes.set(email, { code, expires });

    return c.json({ 
      message: 'Если пользователь существует, код отправлен'
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

auth.post('/reset-password', async (c) => {
  try {
    const { email, code, newPassword } = await c.req.json();

    if (!email || !code || !newPassword) {
      return c.json({ error: 'email, code и newPassword обязательны' }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ error: 'Пароль должен быть не менее 6 символов' }, 400);
    }

    const resetData = resetCodes.get(email);
    if (!resetData) {
      return c.json({ error: 'Код не найден или истёк' }, 400);
    }

    if (resetData.code !== code) {
      return c.json({ error: 'Неверный код' }, 400);
    }

    if (Date.now() > resetData.expires) {
      resetCodes.delete(email);
      return c.json({ error: 'Код истёк' }, 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.runAsync(
      'UPDATE users SET passwordHash = ? WHERE email = ?',
      [passwordHash, email]
    );

    resetCodes.delete(email);

    return c.json({ message: 'Пароль успешно изменён' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default auth;
