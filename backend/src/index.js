import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import 'dotenv/config';
import auth from './routes/auth.js';
import productsRouter from './routes/products.js';
import cart from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import admin from './routes/admin.js';

const app = new Hono();

const PORT = parseInt(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const DEV_URLS = [
  FRONTEND_URL,
  'http://localhost:5500',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5500'
];

// CORS
app.use('*', cors({
  origin: DEV_URLS,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Маршруты
app.route('/api/auth', auth);
app.route('/api/products', productsRouter);
app.route('/api/cart', cart);
app.route('/api/orders', ordersRouter);
app.route('/api/admin', admin);

// Health check
app.get('/', (c) => {
  return c.json({ message: 'SKAM API is running' });
});

// Запуск сервера
serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});
