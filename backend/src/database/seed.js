import bcrypt from 'bcryptjs';

export const seedProducts = (db) => {
  db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
    if (err) {
      console.error('Ошибка проверки товаров:', err);
      return;
    }

    if (row.count > 0) {
      console.log('Товары уже существуют, пропускаем seed');
      return;
    }

    const products = [
      {
        name: 'VPN сертификат (1 месяц)',
        price: 299,
        category: 'certificates',
        image: 'https://images.unsplash.com/photo-1614064641938-3e8216c604d5?w=300&h=300&fit=crop',
        description: 'Высококачественный VPN доступ с высокой скоростью и надежным шифрованием.',
        stock: 100
      },
      {
        name: 'VPN сертификат (12 месяцев)',
        price: 1999,
        category: 'certificates',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&h=300&fit=crop',
        description: 'Годовой VPN доступ со скидкой.',
        stock: 50
      },
      {
        name: 'Прокси сервер (1 месяц)',
        price: 199,
        category: 'certificates',
        image: 'https://images.unsplash.com/photo-1558494949-ef2a27883bb3?w=300&h=300&fit=crop',
        description: 'Анонимный прокси сервер для безопасного browsing.',
        stock: 200
      },

      {
        name: 'Steam аккаунт с играми',
        price: 1499,
        category: 'accounts',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop',
        description: 'Аккаунт Steam с 10+ играми. Полный доступ, смена всех данных.',
        stock: 15
      },
      {
        name: 'Google аккаунт',
        price: 99,
        category: 'accounts',
        image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=300&fit=crop',
        description: 'Новый Google аккаунт с почтой Gmail.',
        stock: 500
      },
      {
        name: 'Instagram аккаунт (1000+ подписчиков)',
        price: 599,
        category: 'accounts',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=300&fit=crop',
        description: 'Аккаунт Instagram с живой аудиторией.',
        stock: 30
      },

      {
        name: 'Windows 11 Pro',
        price: 899,
        category: 'software',
        image: 'https://images.unsplash.com/photo-1629738722729-7e6b70e83e74?w=300&h=300&fit=crop',
        description: 'Лицензионный ключ Windows 11 Pro.',
        stock: 100
      },
      {
        name: 'Microsoft Office 2021',
        price: 1299,
        category: 'software',
        image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?w=300&h=300&fit=crop',
        description: 'Полный пакет Microsoft Office.',
        stock: 75
      },
      {
        name: 'Adobe Photoshop CC',
        price: 799,
        category: 'software',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop',
        description: 'Adobe Photoshop CC на 1 год.',
        stock: 60
      },

      // Игры
      {
        name: 'Cyberpunk 2077 (Steam Key)',
        price: 1999,
        category: 'games',
        image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=300&h=300&fit=crop',
        description: 'Ключ активации Cyberpunk 2077 для Steam.',
        stock: 40
      },
      {
        name: 'GTA V Premium Edition',
        price: 1499,
        category: 'games',
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=300&fit=crop',
        description: 'Grand Theft Auto V Premium Edition.',
        stock: 55
      },
      {
        name: 'Minecraft Java Edition',
        price: 1299,
        category: 'games',
        image: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=300&h=300&fit=crop',
        description: 'Minecraft Java Edition.',
        stock: 80
      },

      {
        name: 'Netflix Premium (1 месяц)',
        price: 499,
        category: 'subscriptions',
        image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=300&fit=crop',
        description: 'Подписка Netflix Premium на 1 месяц. 4K качество.',
        stock: 100
      },
      {
        name: 'Spotify Premium (1 месяц)',
        price: 199,
        category: 'subscriptions',
        image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300&h=300&fit=crop',
        description: 'Spotify Premium на 1 месяц. Без рекламы.',
        stock: 150
      },
      {
        name: 'Discord Nitro (1 месяц)',
        price: 399,
        category: 'subscriptions',
        image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=300&fit=crop',
        description: 'Discord Nitro на 1 месяц.',
        stock: 120
      },
      {
        name: 'YouTube Premium (1 месяц)',
        price: 299,
        category: 'subscriptions',
        image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=300&fit=crop',
        description: 'YouTube Premium без рекламы.',
        stock: 90
      },

      {
        name: 'Антивирус Kaspersky (1 год)',
        price: 1499,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1563206767-5b1d972e8fb1?w=300&h=300&fit=crop',
        description: 'Kaspersky Internet Security на 1 год.',
        stock: 70
      },
      {
        name: 'Облачное хранилище 1TB (1 год)',
        price: 999,
        category: 'other',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&h=300&fit=crop',
        description: 'Облачное хранилище 1TB на 1 год.',
        stock: 100
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO products (name, price, category, description, image, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    let inserted = 0;
    products.forEach(product => {
      stmt.run(
        [product.name, product.price, product.category, product.description, product.image, product.stock],
        (err) => {
          if (err) {
            console.error('Ошибка вставки товара:', err);
          } else {
            inserted++;
            if (inserted === products.length) {
              console.log(`Добавлено ${inserted} товаров в БД`);
            }
          }
        }
      );
    });

    stmt.finalize();
  });
};

export const seedAdmin = (db) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@skam.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
    if (err) {
      console.error('Ошибка проверки админа:', err);
      return;
    }

    if (!row) {
      const hash = bcrypt.hashSync(adminPassword, 10);
      
      db.run(
        'INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)',
        [adminEmail, hash, 'admin'],
        (err) => {
          if (!err) {
            console.log('Админ создан');
          } else {
            console.error('Ошибка создания админа:', err);
          }
        }
      );
    } else {
      console.log('Админ уже существует');
    }
  });
};