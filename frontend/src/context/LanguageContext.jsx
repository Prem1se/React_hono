import { createContext, useContext, useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const translations = {
  ru: {
    header: {
      search: 'Поиск',
      catalog: 'Каталог',
      cart: 'Корзина',
      login: 'Вход',
      register: 'Регистрация',
      logout: 'Выйти',
      profile: 'Профиль',
      services: 'Услуги',
      contacts: 'Контакты',
      goToCart: 'Перейти',
      userIcon: '👤',
    },
    home: {
      title: '',
      subtitle: '',
      popularProducts: 'Рекомендованные товары',
      popularDescription: 'Самые популярные товары этой недели',
      allProducts: 'Все товары',
      allDescription: 'Полный каталог наших товаров',
      seeAll: 'Смотреть все',
    },
    hero: {
      badge: 'Система активна • 24/7',
      titlePart1: 'Цифровые товары',
      titlePart2: 'мгновенной доставки',
      subtitle: 'Игры, VPN, софт, аккаунты и подписки. Автоматическая выдача, гарантия качества, поддержка 24/7.',
      browse: 'В каталог',
      allProducts: 'Все товары',
      popular: 'Популярное',
    },
    loading: 'Загрузка...',
    back: 'Назад',
    forward: 'Вперёд',
    productsNotFound: 'Товары не найдены',
    filterToggle: 'Фильтры',
    filterReset: 'Сбросить',
    filterMinPrice: 'Цена от',
    filterMaxPrice: 'Цена до',
    filterSort: 'Сортировка',
    filterDefault: 'По умолчанию',
    filterPriceAsc: 'Сначала дешёвые',
    filterPriceDesc: 'Сначала дорогие',
    filterFound: 'Найдено',
    filterOf: 'из',
    filterSortAsc: '↑',
    filterSortDesc: '↓',
    admin: {
      panel: 'Админ-панель',
      products: 'Товары',
      users: 'Пользователи',
      orders: 'Заказы',
      stats: 'Статистика',
      totalUsers: 'Пользователей',
      totalOrders: 'Заказов',
      totalRevenue: 'Общий доход',
      averageCheck: 'Средний чек',
      regularUsers: 'Обычные пользователи',
      administrators: 'Администраторы',
      ordersList: 'Заказы пользователя',
      noOrders: 'У пользователя пока нет заказов',
      noRegisteredUsers: 'Пока нет зарегистрированных пользователей',
      noOrdersYet: 'Пока нет заказов',
      viewOrders: 'Заказы',
      addProduct: '+ Добавить товар',
      cancel: 'Отмена',
      editProduct: 'Редактировать товар',
      newProduct: 'Новый товар',
      save: 'Сохранить',
      create: 'Создать',
      deleteConfirm: 'Удалить этот товар?',
      productUpdated: 'Товар обновлён',
      productCreated: 'Товар создан',
      productDeleted: 'Товар удален',
      productSaveError: 'Ошибка сохранения',
      productsTableId: 'ID',
      productsTableImage: 'Изображение',
      productsTableName: 'Название',
      productsTableCategory: 'Категория',
      productsTablePrice: 'Цена',
      productsTableStock: 'Остаток',
      productsTableActions: 'Действия',
      edit: 'Редактировать',
      delete: 'Удалить',
      userRegistered: 'Зарегистрирован',
      orderNumber: 'Заказ #',
      orderDate: 'Дата',
      customer: 'Покупатель',
      account: 'Аккаунт',
      total: 'Итого',
      role: 'Роль',
      unknown: 'Неизвестно',
      productsDescription: 'Описание',
    },
    cart: {
      title: 'Корзина',
      empty: 'Корзина пуста',
      emptyDescription: 'Добавьте товары для начала покупок',
      continueShopping: 'Продолжить покупки',
      total: 'Итого',
      checkout: 'Оформить заказ',
    },
    product: {
      addToCart: 'Добавить в корзину',
      added: 'Добавлено в корзину',
      description: 'Описание',
      inStock: 'В наличии',
      quantity: 'Количество',
      back: 'Назад к товарам',
      notFound: 'Товар не найден',
      sales: '🔥',
    },
    profile: {
      title: 'Профиль',
      purchaseHistory: 'История покупок',
      noPurchases: 'У вас пока нет покупок',
      goToProducts: 'Перейти к товарам',
      notAuthorized: 'Вы не авторизованы',
      loginRequired: 'Войдите в аккаунт, чтобы видеть историю покупок',
      changePassword: 'Изменить пароль',
    },
    auth: {
      email: 'Email',
      password: 'Пароль',
      currentPassword: 'Текущий пароль',
      newPassword: 'Новый пароль',
      confirmPassword: 'Подтвердите пароль',
      passwordMismatch: 'Пароли не совпадают',
      passwordChanged: 'Пароль успешно изменен',
      loginTitle: 'Войти',
      registerTitle: 'Регистрация',
      noAccount: 'Нет аккаунта?',
      hasAccount: 'Уже есть аккаунт?',
      registerNow: 'Зарегистрироваться',
      loginNow: 'Войти',
      forgotPassword: 'Забыли пароль?',
    },
    checkout: {
      title: 'Оформление заказа',
      contactInfo: 'Контактные данные',
      fullName: 'ФИО',
      phone: 'Телефон',
      email: 'Email',
      order: 'Заказ',
      pay: 'Оплатить',
      processing: 'Обработка...',
      success: 'Оплата успешна!',
      successMessage: 'Спасибо за покупку. Подтверждение отправлено на email.',
      fillAllFields: 'Заполните все поля',
      invalidEmail: 'Некорректный email',
      cartEmpty: 'Корзина пуста',
    },
    categories: {
      certificates: { name: 'Сертификаты', description: 'VPN, прокси и другие' },
      accounts: { name: 'Аккаунты', description: 'Аккаунты сервисов' },
      software: { name: 'ПО', description: 'Лицензионное ПО' },
      games: { name: 'Игры', description: 'Игровые ключи' },
      subscriptions: { name: 'Подписки', description: 'Стриминговые сервисы' },
      other: { name: 'Другое', description: 'Прочие товары' },
    },
    languages: {
      ru: 'Русский',
      en: 'English',
    },
    popular: {
      errorTitle: 'Ошибка загрузки',
      checkBackend: 'Проверьте, что бэкенд запущен: http://localhost:3000',
      tryAgain: 'Попробовать снова',
    },
    advantages: {
      title: 'Почему выбирают нас',
      subtitle: 'Мы создали лучший опыт покупки цифровых товаров',
      instant: 'Мгновенная доставка',
      instantDesc: 'Автоматическая выдача товаров сразу после оплаты. Без ожидания, без задержек.',
      guarantee: 'Гарантия качества',
      guaranteeDesc: 'Все товары проверены. Гарантия замены в течение 30 дней на каждый товар.',
      benefits: 'Выгодные цены',
      benefitsDesc: 'Скидки и акции до 40%. Бонусная программа с кешбэком для постоянных клиентов.',
      support: 'Поддержка 24/7',
      supportDesc: 'Помощь в выборе и настройке. Среднее время ответа — 5 минут, работаем круглосуточно.',
    },
    how: {
      title: 'Как это работает',
      subtitle: 'Всего 4 простых шага от выбора до получения товара',
      step1title: 'Выберите товар',
      step1desc: 'Просмотрите каталог, выберите нужный товар из игр, VPN, софта, аккаунтов или подписок.',
      step2title: 'Оформите заказ',
      step2desc: 'Добавьте товар в корзину, заполните контактные данные и оплатите удобным способом.',
      step3title: 'Получите товар',
      step3desc: 'После оплаты товар выдаётся автоматически — ключ, аккаунт или подписка придут мгновенно.',
      step4title: 'Пользуйтесь и экономьте',
      step4desc: 'Активируйте товар, пользуйтесь и получайте кешбэк для следующих покупок.',
    },
    footer: {
      brand: 'SKAM',
      subtitle: 'Цифровые товары и услуги',
      categories: 'Каталог',
      info: 'Информация',
      about: 'О нас',
      terms: 'Условия использования',
      privacy: 'Политика конфиденциальности',
      contact: 'Контакты',
      support: 'Поддержка',
      email: 'support@skam.com',
      telegram: 'Telegram: @skam_support',
      copyright: '2025 SKAM. Все права защищены.',
    },
    productTabs: {
      title: 'Актуальные предложения',
      description: 'Игры, VPN, софт, аккаунты и подписки — всё с мгновенной выдачей',
      noProducts: 'Товары в этой категории скоро появятся',
      viewAll: 'Смотреть весь каталог',
      tab: {
        all: 'Все',
        games: 'Игры',
        certificates: 'VPN',
        software: 'Софт',
        accounts: 'Аккаунты',
        subscriptions: 'Подписки',
      },
    },
  },
  en: {
    header: {
      search: 'Search',
      catalog: 'Catalog',
      cart: 'Cart',
      login: 'Sign In',
      register: 'Register',
      logout: 'Sign Out',
      profile: 'Profile',
      services: 'Services',
      contacts: 'Contacts',
      goToCart: 'Go to Cart',
      userIcon: '👤',
    },
    home: {
      title: '',
      subtitle: '',
      popularProducts: 'Recommended Products',
      popularDescription: 'Most popular products this week',
      allProducts: 'All Products',
      allDescription: 'Full catalog of our products',
      seeAll: 'View all',
    },
    hero: {
      badge: 'System active • 24/7',
      titlePart1: 'Digital goods',
      titlePart2: 'instant delivery',
      subtitle: 'Games, VPN, software, accounts and subscriptions. Automated delivery, quality guarantee, 24/7 support.',
      browse: 'Browse Catalog',
      allProducts: 'All Products',
      popular: 'Popular',
    },
    loading: 'Loading...',
    back: 'Back',
    forward: 'Forward',
    productsNotFound: 'Products not found',
    filterToggle: 'Filters',
    filterReset: 'Reset',
    changePassword: 'Change Password',
    filterMinPrice: 'Min Price',
    filterMaxPrice: 'Max Price',
    filterSort: 'Sort',
    filterDefault: 'Default',
    filterPriceAsc: 'Price: Low to High',
    filterPriceDesc: 'Price: High to Low',
    filterFound: 'Found',
    filterOf: 'of',
    filterSortAsc: '↑',
    filterSortDesc: '↓',
    passwordChanged: 'Password successfully changed',
    admin: {
      panel: 'Admin Panel',
      products: 'Products',
      users: 'Users',
      orders: 'Orders',
      stats: 'Statistics',
      totalUsers: 'Users',
      totalOrders: 'Orders',
      totalRevenue: 'Total Revenue',
      averageCheck: 'Average Check',
      regularUsers: 'Regular Users',
      administrators: 'Administrators',
      ordersList: 'User Orders',
      noOrders: 'User has no orders yet',
      noRegisteredUsers: 'No registered users yet',
      noOrdersYet: 'No orders yet',
      viewOrders: 'Orders',
      addProduct: '+ Add Product',
      cancel: 'Cancel',
      editProduct: 'Edit Product',
      newProduct: 'New Product',
      save: 'Save',
      create: 'Create',
      deleteConfirm: 'Delete this product?',
      productUpdated: 'Product updated',
      productCreated: 'Product created',
      productDeleted: 'Product deleted',
      productSaveError: 'Save error',
      productsTableId: 'ID',
      productsTableImage: 'Image',
      productsTableName: 'Name',
      productsTableCategory: 'Category',
      productsTablePrice: 'Price',
      productsTableStock: 'Stock',
      productsTableActions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      userRegistered: 'Registered',
      orderNumber: 'Order #',
      orderDate: 'Date',
      customer: 'Customer',
      account: 'Account',
      total: 'Total',
      role: 'Role',
      unknown: 'Unknown',
      productsDescription: 'Description',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      emptyDescription: 'Add some products to get started',
      continueShopping: 'Continue Shopping',
      total: 'Total',
      checkout: 'Checkout',
    },
    product: {
      addToCart: 'Add to Cart',
      added: 'Added to Cart',
      description: 'Description',
      inStock: 'In Stock',
      quantity: 'Quantity',
      back: 'Back to Products',
      notFound: 'Product not found',
      sales: '🔥',
    },
    profile: {
      title: 'Profile',
      purchaseHistory: 'Purchase History',
      noPurchases: 'You have no purchases yet',
      goToProducts: 'Go to Products',
      notAuthorized: 'You are not authorized',
      loginRequired: 'Sign in to see your purchase history',
      changePassword: 'Change Password',
    },
    auth: {
      email: 'Email',
      password: 'Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordMismatch: 'Passwords do not match',
      passwordChanged: 'Password successfully changed',
      loginTitle: 'Sign In',
      registerTitle: 'Register',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      registerNow: 'Register Now',
      loginNow: 'Sign In',
      forgotPassword: 'Forgot Password?',
    },
    checkout: {
      title: 'Checkout',
      contactInfo: 'Contact Information',
      fullName: 'Full Name',
      phone: 'Phone',
      email: 'Email',
      order: 'Order',
      pay: 'Pay',
      processing: 'Processing...',
      success: 'Payment Successful!',
      successMessage: 'Thank you for your purchase. Confirmation sent to email.',
      fillAllFields: 'Fill in all fields',
      invalidEmail: 'Invalid email',
      cartEmpty: 'Cart is empty',
    },
    categories: {
      certificates: { name: 'Certificates', description: 'VPN, proxy and others' },
      accounts: { name: 'Accounts', description: 'Service accounts' },
      software: { name: 'Software', description: 'Licensed software' },
      games: { name: 'Games', description: 'Game keys' },
      subscriptions: { name: 'Subscriptions', description: 'Streaming services' },
      other: { name: 'Other', description: 'Other products' },
    },
    languages: {
      ru: 'Русский',
      en: 'English',
    },
    popular: {
      errorTitle: 'Error loading',
      checkBackend: 'Check that the backend is running: http://localhost:3000',
      tryAgain: 'Try again',
    },
    advantages: {
      title: 'Why Choose Us',
      subtitle: 'We created the best experience for buying digital products',
      instant: 'Instant Delivery',
      instantDesc: 'Automatic delivery of products immediately after payment. No waiting, no delays.',
      guarantee: 'Quality Guarantee',
      guaranteeDesc: 'All products are verified. Replacement guarantee for 30 days on each product.',
      benefits: 'Great Prices',
      benefitsDesc: 'Discounts and promotions up to 40%. Bonus program with cashback for regular customers.',
      support: '24/7 Support',
      supportDesc: 'Help with selection and setup. Average response time — 5 minutes, working around the clock.',
    },
    how: {
      title: 'How It Works',
      subtitle: 'Just 4 simple steps from selection to receiving your product',
      step1title: 'Choose a product',
      step1desc: 'Browse the catalog, select the product you need from games, VPN, software, accounts or subscriptions.',
      step2title: 'Place an order',
      step2desc: 'Add the product to your cart, fill in your contact details and pay using a convenient method.',
      step3title: 'Receive your product',
      step3desc: 'After payment, the product is delivered automatically — key, account or subscription arrives instantly.',
      step4title: 'Use and save',
      step4desc: 'Activate the product, use it and get cashback for future purchases.',
    },
    footer: {
      brand: 'SKAM',
      subtitle: 'Digital Products and Services',
      categories: 'Categories',
      info: 'Information',
      about: 'About Us',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      contact: 'Contact',
      support: 'Support',
      email: 'support@skam.com',
      telegram: 'Telegram: @skam_support',
      copyright: '2025 SKAM. All rights reserved.',
    },
    productTabs: {
      title: 'Featured Offers',
      description: 'Games, VPN, software, accounts and subscriptions — all with instant delivery',
      noProducts: 'Products in this category will be available soon',
      viewAll: 'View full catalog',
      tab: {
        all: 'All',
        games: 'Games',
        certificates: 'VPN',
        software: 'Software',
        accounts: 'Accounts',
        subscriptions: 'Subscriptions',
      },
    },
  },
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ru';
  });

  const [categories, setCategories] = useState({});

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Загружаем категории с бэкенда
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productsAPI.getCategories();
        const catMap = {};
        data.forEach(cat => {
          catMap[cat.slug] = { name: cat.name };
        });
        setCategories(catMap);
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err);
      }
    };
    fetchCategories();
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value;
  };

  // Получаем название категории — сначала из БД, потом из переводов
  const getCategoryName = (slug) => {
    if (categories[slug]?.name) {
      return categories[slug].name;
    }
    // Fallback к переводу из translations
    return t(`categories.${slug}.name`) || slug;
  };

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    // При смене языка перезагружаем категории
    try {
      const data = await productsAPI.getCategories();
      const catMap = {};
      data.forEach(cat => {
        catMap[cat.slug] = { name: cat.name };
      });
      setCategories(catMap);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, categories, getCategoryName }}>
      {children}
    </LanguageContext.Provider>
  );
};
