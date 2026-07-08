import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../database/db.js';
import { authMiddleware, generateToken, JWT_SECRET } from '../middleware/auth.js';

const auth = new Hono();

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const generateResetCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const resetCodes = new Map();

auth.post('/register', (c) => {
  return new Promise(async (resolve) => {
    try {
      const { email, password } = await c.req.json();

      if (!email || !password) {
        return resolve(c.json({ error: 'Email и пароль обязательны' }, 400));
      }

      if (!isValidEmail(email)) {
        return resolve(c.json({ error: 'Некорректный email' }, 400));
      }

      if (password.length < 6) {
        return resolve(c.json({ error: 'Пароль должен быть не менее 6 символов' }, 400));
      }

      db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }

        if (row) {
          return resolve(c.json({ error: 'Пользователь с таким email уже существует' }, 409));
        }

        const passwordHash = await bcrypt.hash(password, 10);

        db.run(
          'INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)',
          [email, passwordHash, 'user'],
          function(err) {
            if (err) {
              return resolve(c.json({ error: err.message }, 500));
            }

            const userId = this.lastID;
            const token = generateToken(userId);

            resolve(c.json({
              token,
              user: { id: userId, email, role: 'user' }
            }, 201));
          }
        );
      });
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      resolve(c.json({ error: error.message }, 500));
    }
  });
});

// Вход
auth.post('/login', (c) => {
  return new Promise(async (resolve) => {
    try {
      const { email, password } = await c.req.json();

      if (!email || !password) {
        return resolve(c.json({ error: 'Email и пароль обязательны' }, 400));
      }

      if (!isValidEmail(email)) {
        return resolve(c.json({ error: 'Некорректный email' }, 400));
      }

      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }

        if (!user) {
          return resolve(c.json({ error: 'Пользователь не найден' }, 404));
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return resolve(c.json({ error: 'Неверный пароль' }, 401));
        }

        const token = generateToken(user.id);

        resolve(c.json({
          token,
          user: { 
            id: user.id, 
            email: user.email,
            role: user.role || 'user'
          }
        }));
      });
    } catch (error) {
      console.error('Ошибка входа:', error);
      resolve(c.json({ error: error.message }, 500));
    }
  });
});

auth.get('/me', authMiddleware, (c) => {
  return new Promise((resolve) => {
    const userId = c.get('userId');
    
    db.get('SELECT id, email, role FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return resolve(c.json({ error: err.message }, 500));
      }
      if (!user) {
        return resolve(c.json({ error: 'Пользователь не найден' }, 404));
      }
      resolve(c.json({
        id: user.id,
        email: user.email,
        role: user.role || 'user'
      }));
    });
  });
});

auth.post('/forgot-password', (c) => {
  return new Promise(async (resolve) => {
    try {
      const { email } = await c.req.json();

      if (!email || !isValidEmail(email)) {
        return resolve(c.json({ error: 'Некорректный email' }, 400));
      }

      db.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          return resolve(c.json({ error: err.message }, 500));
        }

        if (!user) {
          return resolve(c.json({ message: 'Если пользователь существует, код отправлен' }));
        }

        const code = generateResetCode();
        const expires = Date.now() + 15 * 60 * 1000;

        resetCodes.set(email, { code, expires });

        resolve(c.json({ 
          message: 'Если пользователь существует, код отправлен'
        }));
      });
    } catch (error) {
      console.error('Ошибка восстановления:', error);
      resolve(c.json({ error: error.message }, 500));
    }
  });
});

auth.post('/reset-password', (c) => {
  return new Promise(async (resolve) => {
    try {
      const { email, code, newPassword } = await c.req.json();

      if (!email || !code || !newPassword) {
        return resolve(c.json({ error: 'email, code и newPassword обязательны' }, 400));
      }

      if (newPassword.length < 6) {
        return resolve(c.json({ error: 'Пароль должен быть не менее 6 символов' }, 400));
      }

      const resetData = resetCodes.get(email);
      if (!resetData) {
        return resolve(c.json({ error: 'Код не найден или истёк' }, 400));
      }

      if (resetData.code !== code) {
        return resolve(c.json({ error: 'Неверный код' }, 400));
      }

      if (Date.now() > resetData.expires) {
        resetCodes.delete(email);
        return resolve(c.json({ error: 'Код истёк' }, 400));
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      db.run(
        'UPDATE users SET passwordHash = ? WHERE email = ?',
        [passwordHash, email],
        function(err) {
          if (err) {
            return resolve(c.json({ error: err.message }, 500));
          }

          resetCodes.delete(email);

          resolve(c.json({ message: 'Пароль успешно изменён' }));
        }
      );
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      resolve(c.json({ error: error.message }, 500));
    }
  });
});

export default auth;