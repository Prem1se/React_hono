import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSchema } from './schema.js';
import { seedProducts, seedAdmin } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH 
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '../../shop.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('Подключено к SQLite базе данных');
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('❌ Ошибка включения foreign_keys:', err.message);
      }
      initSchema(db);
      seedProducts(db);
      seedAdmin(db);
    });
  }
});

export default db;