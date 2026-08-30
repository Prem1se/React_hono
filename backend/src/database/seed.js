import bcrypt from 'bcryptjs';

export const seedCategories = async (db) => {
  const row = await db.getAsync('SELECT COUNT(*) as count FROM categories');

  if (row.count > 0) {
    console.log('Категории уже существуют, пропускаем seed');
    return;
  }

  const categories = [
    {
      slug: 'certificates',
      nameRu: 'Сертификаты',
      nameEn: 'Certificates',
      descRu: 'VPN, прокси и другие цифровые ключи',
      descEn: 'VPN, proxy and other digital keys',
      order: 1
    },
    {
      slug: 'accounts',
      nameRu: 'Аккаунты',
      nameEn: 'Accounts',
      descRu: 'Аккаунты сервисов',
      descEn: 'Service accounts',
      order: 2
    },
    {
      slug: 'software',
      nameRu: 'ПО',
      nameEn: 'Software',
      descRu: 'Лицензионное программное обеспечение',
      descEn: 'Licensed software',
      order: 3
    },
    {
      slug: 'games',
      nameRu: 'Игры',
      nameEn: 'Games',
      descRu: 'Игровые ключи и аккаунты',
      descEn: 'Game keys and accounts',
      order: 4
    },
    {
      slug: 'subscriptions',
      nameRu: 'Подписки',
      nameEn: 'Subscriptions',
      descRu: 'Стриминговые сервисы',
      descEn: 'Streaming services',
      order: 5
    },
    {
      slug: 'other',
      nameRu: 'Другое',
      nameEn: 'Other',
      descRu: 'Прочие товары',
      descEn: 'Other products',
      order: 6
    }
  ];

  for (const cat of categories) {
    try {
      await db.runAsync(
        'INSERT INTO categories (slug, name_ru, name_en, description_ru, description_en, orderIndex) VALUES (?, ?, ?, ?, ?, ?)',
        [cat.slug, cat.nameRu, cat.nameEn, cat.descRu, cat.descEn, cat.order]
      );
    } catch (err) {
      console.error('Ошибка вставки категории:', err.message);
    }
  }

  console.log(`Добавлено ${categories.length} категорий в БД`);
};

export const seedProducts = async (db) => {
  const row = await db.getAsync('SELECT COUNT(*) as count FROM products');

  if (row.count > 0) {
    console.log('Товары уже существуют, пропускаем seed');
    return;
  }

  // Получаем ID категорий по slug
  const categories = await db.allAsync('SELECT id, slug FROM categories');
  const categoryMap = {};
  categories.forEach(c => categoryMap[c.slug] = c.id);

  const products = [
    {
      nameRu: 'Доступ к интернету (1 месяц)',
      nameEn: 'Internet Access (1 month)',
      price: 299,
      categoryId: categoryMap['certificates'],
      image: '/images/VPN.png',
      descRu: 'Высококачественный VPN доступ с высокой скоростью и надежным шифрованием.',
      descEn: 'High-quality VPN access with high speed and reliable encryption.',
      stock: 100
    },
    {
      nameRu: 'Доступ к интернету (12 месяцев)',
      nameEn: 'Internet Access (12 months)',
      price: 1999,
      categoryId: categoryMap['certificates'],
      image: '/images/VPN.png',
      descRu: 'Годовой VPN доступ со скидкой.',
      descEn: 'Annual VPN access with discount.',
      stock: 50
    },
    {
      nameRu: 'Прокси сервер (1 месяц)',
      nameEn: 'Proxy Server (1 month)',
      price: 199,
      categoryId: categoryMap['certificates'],
      image: '/images/proxy.png',
      descRu: 'Анонимный прокси сервер для безопасного browsing.',
      descEn: 'Anonymous proxy server for safe browsing.',
      stock: 200
    },

    {
      nameRu: 'Steam аккаунт с играми',
      nameEn: 'Steam account with games',
      price: 1499,
      categoryId: categoryMap['accounts'],
      image: '/images/steam.png',
      descRu: 'Аккаунт Steam с 10+ играми. Полный доступ, смена всех данных.',
      descEn: 'Steam account with 10+ games. Full access, change all data.',
      stock: 15
    },
    {
      nameRu: 'Google аккаунт',
      nameEn: 'Google account',
      price: 99,
      categoryId: categoryMap['accounts'],
      image: '/images/google.png',
      descRu: 'Новый Google аккаунт с почтой Gmail.',
      descEn: 'New Google account with Gmail.',
      stock: 500
    },
    {
      nameRu: 'Instagram аккаунт (1000+ подписчиков)',
      nameEn: 'Instagram account (1000+ followers)',
      price: 599,
      categoryId: categoryMap['accounts'],
      image: '/images/instagram.png',
      descRu: 'Аккаунт Instagram с живой аудиторией.',
      descEn: 'Instagram account with live audience.',
      stock: 30
    },

    {
      nameRu: 'Windows 11 Pro',
      nameEn: 'Windows 11 Pro',
      price: 899,
      categoryId: categoryMap['software'],
      image: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Windows_11_Pro_logo.svg',
      descRu: 'Лицензионный ключ Windows 11 Pro.',
      descEn: 'Licensed key for Windows 11 Pro.',
      stock: 100
    },
    {
      nameRu: 'Microsoft Office 2021',
      nameEn: 'Microsoft Office 2021',
      price: 1299,
      categoryId: categoryMap['software'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_Office_2021_logo.svg',
      descRu: 'Полный пакет Microsoft Office.',
      descEn: 'Full Microsoft Office package.',
      stock: 75
    },
    {
      nameRu: 'Adobe Photoshop CC',
      nameEn: 'Adobe Photoshop CC',
      price: 799,
      categoryId: categoryMap['software'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Adobe_Photoshop_CC_logo.svg',
      descRu: 'Adobe Photoshop CC на 1 год.',
      descEn: 'Adobe Photoshop CC for 1 year.',
      stock: 60
    },

    {
      nameRu: 'Cyberpunk 2077 (Steam Key)',
      nameEn: 'Cyberpunk 2077 (Steam Key)',
      price: 1999,
      categoryId: categoryMap['games'],
      image: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Cyberpunk_2077_box_art.jpg',
      descRu: 'Ключ активации Cyberpunk 2077 для Steam.',
      descEn: 'Activation key for Cyberpunk 2077 on Steam.',
      stock: 40
    },
    {
      nameRu: 'GTA V Premium Edition',
      nameEn: 'GTA V Premium Edition',
      price: 1499,
      categoryId: categoryMap['games'],
      image: 'https://upload.wikimedia.org/wikipedia/en/5/57/GTA_V_Boxart.jpg',
      descRu: 'Grand Theft Auto V Premium Edition.',
      descEn: 'Grand Theft Auto V Premium Edition.',
      stock: 55
    },
    {
      nameRu: 'Minecraft Java Edition',
      nameEn: 'Minecraft Java Edition',
      price: 1299,
      categoryId: categoryMap['games'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Minecraft_box_art.jpg',
      descRu: 'Minecraft Java Edition.',
      descEn: 'Minecraft Java Edition.',
      stock: 80
    },

    {
      nameRu: 'Netflix Premium (1 месяц)',
      nameEn: 'Netflix Premium (1 month)',
      price: 499,
      categoryId: categoryMap['subscriptions'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Netflix_2015_logo.svg',
      descRu: 'Подписка Netflix Premium на 1 месяц. 4K качество.',
      descEn: 'Netflix Premium subscription for 1 month. 4K quality.',
      stock: 100
    },
    {
      nameRu: 'Spotify Premium (1 месяц)',
      nameEn: 'Spotify Premium (1 month)',
      price: 199,
      categoryId: categoryMap['subscriptions'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      descRu: 'Spotify Premium на 1 месяц. Без рекламы.',
      descEn: 'Spotify Premium for 1 month. No ads.',
      stock: 150
    },
    {
      nameRu: 'Discord Nitro (1 месяц)',
      nameEn: 'Discord Nitro (1 month)',
      price: 399,
      categoryId: categoryMap['subscriptions'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Discord_logo.svg',
      descRu: 'Discord Nitro на 1 месяц.',
      descEn: 'Discord Nitro for 1 month.',
      stock: 120
    },
    {
      nameRu: 'YouTube Premium (1 месяц)',
      nameEn: 'YouTube Premium (1 month)',
      price: 299,
      categoryId: categoryMap['subscriptions'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/YouTube_Premium_logo.svg',
      descRu: 'YouTube Premium без рекламы.',
      descEn: 'YouTube Premium without ads.',
      stock: 90
    },

    {
      nameRu: 'Антивирус Kaspersky (1 год)',
      nameEn: 'Kaspersky Antivirus (1 year)',
      price: 1499,
      categoryId: categoryMap['other'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Kaspersky_Lab_logo.svg',
      descRu: 'Kaspersky Internet Security на 1 год.',
      descEn: 'Kaspersky Internet Security for 1 year.',
      stock: 70
    },
    {
      nameRu: 'Облачное хранилище 1TB (1 год)',
      nameEn: 'Cloud Storage 1TB (1 year)',
      price: 999,
      categoryId: categoryMap['other'],
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Google_Drive_logo.svg',
      descRu: 'Облачное хранилище 1TB на 1 год.',
      descEn: 'Cloud storage 1TB for 1 year.',
      stock: 100
    }
  ];

  for (const product of products) {
    try {
      await db.runAsync(
        'INSERT INTO products (name, name_ru, name_en, price, categoryId, description, description_ru, description_en, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          product.nameRu,
          product.nameRu,
          product.nameEn,
          product.price,
          product.categoryId,
          product.descRu,
          product.descRu,
          product.descEn,
          product.image,
          product.stock
        ]
      );
    } catch (err) {
      console.error('Ошибка вставки товара:', err.message);
    }
  }

  console.log(`Добавлено ${products.length} товаров в БД`);
};

export const seedAdmin = async (db) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@skam.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  const row = await db.getAsync('SELECT id FROM users WHERE email = ?', [adminEmail]);

  if (row) {
    console.log('Админ уже существует');
    return;
  }

  const hash = bcrypt.hashSync(adminPassword, 10);
  
  try {
    await db.runAsync(
      'INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)',
      [adminEmail, hash, 'admin']
    );
    console.log('Админ создан');
  } catch (err) {
    console.error('Ошибка создания админа:', err.message);
  }
};
