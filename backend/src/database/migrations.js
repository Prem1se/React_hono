const db = null; // Будет передан как аргумент

// Генерируем уникальный slug из названия категории
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return map[char.toLowerCase()] || char;
    })
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/_+$/, '')
    .replace(/^_/, '');
};

export const migrateSchema = async (db) => {
  console.log('Проверка и применение миграций...');
  
  // Проверяем, есть ли новая структура
  const categoriesExist = await db.getAsync(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='categories'
  `);
  
  if (!categoriesExist) {
    console.log('Создание таблицы categories...');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name_ru TEXT NOT NULL DEFAULT '',
        name_en TEXT NOT NULL DEFAULT '',
        description_ru TEXT NOT NULL DEFAULT '',
        description_en TEXT NOT NULL DEFAULT '',
        orderIndex INTEGER DEFAULT 0,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Создаём индексы для categories
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
    `);
    
    console.log('Таблица categories создана');
  }
  
  // Проверяем, есть ли oldPrice в products
  const hasOldPrice = await db.getAsync(`
    SELECT name FROM pragma_table_info('products') WHERE name='oldPrice'
  `);
  
  if (!hasOldPrice) {
    console.log('Добавление oldPrice в products...');
    await db.execAsync(`
      ALTER TABLE products ADD COLUMN oldPrice REAL;
    `);
  }
  
  // Проверяем, есть ли isActive в products
  const hasIsActive = await db.getAsync(`
    SELECT name FROM pragma_table_info('products') WHERE name='isActive'
  `);
  
  if (!hasIsActive) {
    console.log('Добавление isActive в products...');
    await db.execAsync(`
      ALTER TABLE products ADD COLUMN isActive BOOLEAN DEFAULT 1;
    `);
  }
  
  // Проверяем, есть ли stock в products (если нет — добавляем)
  const hasStock = await db.getAsync(`
    SELECT name FROM pragma_table_info('products') WHERE name='stock'
  `);
  
  if (!hasStock) {
    console.log('Добавление stock в products...');
    await db.execAsync(`
      ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;
    `);
  }
  
  // Проверяем, есть ли updatedAt в products
  const hasUpdatedAt = await db.getAsync(`
    SELECT name FROM pragma_table_info('products') WHERE name='updatedAt'
  `);
  
  if (!hasUpdatedAt) {
    console.log('Добавление updatedAt в products...');
    await db.execAsync(`
      ALTER TABLE products ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP;
    `);
  }
  
  // Проверяем, есть ли updatedAt в users
  const hasUsersUpdatedAt = await db.getAsync(`
    SELECT name FROM pragma_table_info('users') WHERE name='updatedAt'
  `);
  
  if (!hasUsersUpdatedAt) {
    console.log('Добавление updatedAt в users...');
    await db.execAsync(`
      ALTER TABLE users ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP;
    `);
  }
  
  // Проверяем, есть ли updatedAt в orders
  const hasOrdersUpdatedAt = await db.getAsync(`
    SELECT name FROM pragma_table_info('orders') WHERE name='updatedAt'
  `);
  
  if (!hasOrdersUpdatedAt) {
    console.log('Добавление updatedAt в orders...');
    await db.execAsync(`
      ALTER TABLE orders ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP;
    `);
  }
  
  // Добавляем индексы
  console.log('Создание индексов...');
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_cart_userId ON cart(userId);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders(userId);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_order_items_orderId ON order_items(orderId);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_order_items_productId ON order_items(productId);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_products_categoryId ON products(categoryId);
  `);
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_products_isActive ON products(isActive);
  `);
  
  console.log('Миграции применены успешно');
};
