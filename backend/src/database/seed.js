import bcrypt from 'bcryptjs';

export const seedProducts = async (db) => {
  const row = await db.getAsync('SELECT COUNT(*) as count FROM products');

  if (row.count > 0) {
    console.log('Товары уже существуют, пропускаем seed');
    return;
  }

  const products = [
    {
        name: 'Доступ к интернету (1 месяц)',
      price: 299,
      category: 'certificates',
      image: '/images/VPN.png',
      description: 'Высококачественный VPN доступ с высокой скоростью и надежным шифрованием.',
      stock: 100
    },
    {
        name: 'Доступ к интернету (12 месяцев)',
      price: 1999,
      category: 'certificates',
      image: '/images/VPN.png',
      description: 'Годовой VPN доступ со скидкой.',
      stock: 50
    },
    {
      name: 'Прокси сервер (1 месяц)',
      price: 199,
      category: 'certificates',
      image: '/images/proxy.png',
      description: 'Анонимный прокси сервер для безопасного browsing.',
      stock: 200
    },

    {
      name: 'Steam аккаунт с играми',
      price: 1499,
      category: 'accounts',
      image: '/images/steam.png',
      description: 'Аккаунт Steam с 10+ играми. Полный доступ, смена всех данных.',
      stock: 15
    },
    {
      name: 'Google аккаунт',
      price: 99,
      category: 'accounts',
      image: '/images/google.png',
      description: 'Новый Google аккаунт с почтой Gmail.',
      stock: 500
    },
    {
      name: 'Instagram аккаунт (1000+ подписчиков)',
      price: 599,
      category: 'accounts',
      image: '/images/instagram.png',
      description: 'Аккаунт Instagram с живой аудиторией.',
      stock: 30
    },

    {
      name: 'Windows 11 Pro',
      price: 899,
      category: 'software',
      image: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Windows_11_Pro_logo.svg',
      description: 'Лицензионный ключ Windows 11 Pro.',
      stock: 100
    },
    {
      name: 'Microsoft Office 2021',
      price: 1299,
      category: 'software',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_Office_2021_logo.svg',
      description: 'Полный пакет Microsoft Office.',
      stock: 75
    },
    {
      name: 'Adobe Photoshop CC',
      price: 799,
      category: 'software',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Adobe_Photoshop_CC_logo.svg',
      description: 'Adobe Photoshop CC на 1 год.',
      stock: 60
    },

    {
      name: 'Cyberpunk 2077 (Steam Key)',
      price: 1999,
      category: 'games',
      image: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Cyberpunk_2077_box_art.jpg',
      description: 'Ключ активации Cyberpunk 2077 для Steam.',
      stock: 40
    },
    {
      name: 'GTA V Premium Edition',
      price: 1499,
      category: 'games',
      image: 'https://upload.wikimedia.org/wikipedia/en/5/57/GTA_V_Boxart.jpg',
      description: 'Grand Theft Auto V Premium Edition.',
      stock: 55
    },
    {
      name: 'Minecraft Java Edition',
      price: 1299,
      category: 'games',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Minecraft_box_art.jpg',
      description: 'Minecraft Java Edition.',
      stock: 80
    },

    {
      name: 'Netflix Premium (1 месяц)',
      price: 499,
      category: 'subscriptions',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Netflix_2015_logo.svg',
      description: 'Подписка Netflix Premium на 1 месяц. 4K качество.',
      stock: 100
    },
    {
      name: 'Spotify Premium (1 месяц)',
      price: 199,
      category: 'subscriptions',
      image: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      description: 'Spotify Premium на 1 месяц. Без рекламы.',
      stock: 150
    },
    {
      name: 'Discord Nitro (1 месяц)',
      price: 399,
      category: 'subscriptions',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Discord_logo.svg',
      description: 'Discord Nitro на 1 месяц.',
      stock: 120
    },
    {
      name: 'YouTube Premium (1 месяц)',
      price: 299,
      category: 'subscriptions',
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/YouTube_Premium_logo.svg',
      description: 'YouTube Premium без рекламы.',
      stock: 90
    },

    {
      name: 'Антивирус Kaspersky (1 год)',
      price: 1499,
      category: 'other',
      image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Kaspersky_Lab_logo.svg',
      description: 'Kaspersky Internet Security на 1 год.',
      stock: 70
    },
    {
      name: 'Облачное хранилище 1TB (1 год)',
      price: 999,
      category: 'other',
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Google_Drive_logo.svg',
      description: 'Облачное хранилище 1TB на 1 год.',
      stock: 100
    }
  ];

  for (const product of products) {
    try {
      await db.runAsync(
        'INSERT INTO products (name, price, category, description, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.price, product.category, product.description, product.image, product.stock]
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
