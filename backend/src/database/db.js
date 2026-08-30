import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { initSchema } from './schema.js';
import { seedProducts, seedAdmin, seedCategories } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH 
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '../../shop.db');

const db = new sqlite3.Database(DB_PATH, async (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
    return;
  }
  
  // Включаем foreign keys
  await db.run('PRAGMA foreign_keys = ON');
  // journal mode = WAL для лучшей производительности
  await db.run('PRAGMA journal_mode = WAL');
  // Увеличиваем буфер для параллельных операций
  await db.run('PRAGMA busy_timeout = 5000');
  
  await initSchema(db);
  await seedCategories(db);
  await seedProducts(db);
  await seedAdmin(db);
});


db.runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.execAsync = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export default db;
