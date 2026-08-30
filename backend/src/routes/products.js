import { Hono } from 'hono';
import db from '../database/db.js';
import { adminMiddleware } from '../middleware/admin.js';

const productsRouter = new Hono();

// Получаем язык из query параметра или заголовка
const getLang = (c) => {
  return c.req.query('lang') || c.header('accept-language', 'ru').split(',')[0].substring(0, 2) || 'ru';
};

// Определяем, какое имя и описание использовать
const getName = (product, lang) => {
  if (lang === 'en' && product.name_en) return product.name_en;
  return product.name_ru || product.name;
};

const getDescription = (product, lang) => {
  if (lang === 'en' && product.description_en) return product.description_en;
  return product.description_ru || product.description;
};

// Middleware для добавления language в контекст
productsRouter.use('*', async (c, next) => {
  c.set('lang', getLang(c));
  await next();
});

// Создание товара
productsRouter.post('/', adminMiddleware, async (c) => {
  try {
    const { name, nameRu, nameEn, price, categoryId, description, descriptionRu, descriptionEn, image, stock, oldPrice } = await c.req.json();

    if (!nameRu || !price || !categoryId) {
      return c.json({ error: 'nameRu, price и categoryId обязательны' }, 400);
    }

    const result = await db.runAsync(
      'INSERT INTO products (name, name_ru, name_en, price, categoryId, description, description_ru, description_en, image, stock, oldPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        name || nameRu,
        nameRu,
        nameEn || '',
        parseFloat(price),
        parseInt(categoryId),
        description || descriptionRu || '',
        descriptionRu || '',
        descriptionEn || '',
        image || '',
        stock || 0,
        oldPrice ? parseFloat(oldPrice) : null
      ]
    );
    
    const product = await db.getAsync('SELECT * FROM products WHERE id = ?', [result.lastID]);
    return c.json(product, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Обновление товара
productsRouter.put('/:id', adminMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const { name, nameRu, nameEn, price, categoryId, description, descriptionRu, descriptionEn, image, stock, oldPrice } = await c.req.json();

    if (!nameRu || !price || !categoryId) {
      return c.json({ error: 'nameRu, price и categoryId обязательны' }, 400);
    }

    await db.runAsync(
      'UPDATE products SET name = ?, name_ru = ?, name_en = ?, price = ?, categoryId = ?, description = ?, description_ru = ?, description_en = ?, image = ?, stock = ?, oldPrice = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [
        name || nameRu,
        nameRu,
        nameEn || '',
        parseFloat(price),
        parseInt(categoryId),
        description || descriptionRu || '',
        descriptionRu || '',
        descriptionEn || '',
        image || '',
        stock || 0,
        oldPrice ? parseFloat(oldPrice) : null,
        id
      ]
    );
    
    const product = await db.getAsync('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) {
      return c.json({ error: 'Товар не найден' }, 404);
    }
    return c.json(product);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Soft delete товара
productsRouter.delete('/:id', adminMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const result = await db.runAsync(
      'UPDATE products SET isActive = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    if (result.changes === 0) {
      return c.json({ error: 'Товар не найден' }, 404);
    }
    
    return c.json({ message: 'Товар удалён' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Получение списка товаров с переводом
productsRouter.get('/', async (c) => {
  try {
    const lang = c.get('lang');
    const rows = await db.allAsync(`
      SELECT p.*, c.slug as category 
      FROM products p 
      LEFT JOIN categories c ON p.categoryId = c.id 
      WHERE p.isActive = 1
    `);
    
    const result = rows.map(p => ({
      ...p,
      name: getName(p, lang),
      description: getDescription(p, lang)
    }));
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Получение одного товара
productsRouter.get('/:id', async (c) => {
  const lang = c.get('lang');
  const id = parseInt(c.req.param('id'));
  
  try {
    const product = await db.getAsync(`
      SELECT p.*, c.slug as category 
      FROM products p 
      LEFT JOIN categories c ON p.categoryId = c.id 
      WHERE p.id = ? AND p.isActive = 1
    `, [id]);
    if (!product) {
      return c.json({ error: 'Товар не найден' }, 404);
    }
    
    return c.json({
      ...product,
      name: getName(product, lang),
      description: getDescription(product, lang)
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Получение категорий
productsRouter.get('/categories/list', async (c) => {
  try {
    const lang = c.get('lang');
    const rows = await db.allAsync('SELECT * FROM categories WHERE isActive = 1 ORDER BY orderIndex');
    
    const result = rows.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: lang === 'en' && cat.name_en ? cat.name_en : cat.name_ru
    }));
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Популярные товары
productsRouter.get('/popular', async (c) => {
  try {
    const lang = c.get('lang');
    const rows = await db.allAsync(`
      SELECT p.*, c.slug as category, COUNT(oi.id) as purchaseCount
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN order_items oi ON p.id = oi.productId
      WHERE p.isActive = 1
      GROUP BY p.id
      ORDER BY purchaseCount DESC
      LIMIT 4
    `);
    
    const result = rows.map(p => ({
      ...p,
      name: getName(p, lang),
      description: getDescription(p, lang)
    }));
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Поиск товаров
productsRouter.get('/search', async (c) => {
  const lang = c.get('lang');
  const query = c.req.query('q');
  
  if (!query || query.length < 2) {
    return c.json([]);
  }
  
  try {
    const rows = await db.allAsync(`
      SELECT p.*, c.slug as category
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.isActive = 1 AND (
        p.name LIKE ? OR p.name_ru LIKE ? OR p.name_en LIKE ? OR 
        p.description LIKE ? OR p.description_ru LIKE ? OR p.description_en LIKE ?
      ) LIMIT 20
    `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
    
    const result = rows.map(p => ({
      ...p,
      name: getName(p, lang),
      description: getDescription(p, lang)
    }));
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Товары по категории
productsRouter.get('/category/:category', async (c) => {
  const lang = c.get('lang');
  const category = c.req.param('category');
  
  try {
    const cat = await db.getAsync('SELECT id FROM categories WHERE slug = ?', [category]);
    if (!cat) {
      return c.json([]);
    }
    
    const rows = await db.allAsync(`
      SELECT p.*, c.slug as category
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.categoryId = ? AND p.isActive = 1
    `, [cat.id]);
    
    const result = rows.map(p => ({
      ...p,
      name: getName(p, lang),
      description: getDescription(p, lang)
    }));
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default productsRouter;
