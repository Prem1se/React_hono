import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  ru: {
    header: {
      search: 'Поиск',
      catalog: 'Каталог',
      cart: 'Корзина',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      profile: 'Мой профиль',
    },
    home: {
      title: 'Популярные товары',
      subtitle: 'Самые покупаемые товары этой недели',
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
    },
    profile: {
      title: 'Мой профиль',
      purchaseHistory: 'История покупок',
      noPurchases: 'У вас пока нет покупок',
      goToProducts: 'Перейти к товарам',
      notAuthorized: 'Вы не авторизованы',
      loginRequired: 'Войдите в аккаунт чтобы видеть историю покупок',
    },
    auth: {
      email: 'Email',
      password: 'Пароль',
      loginTitle: 'Вход в аккаунт',
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
    footer: {
      categories: 'Категории',
      info: 'Информация',
      about: 'О нас',
      terms: 'Условия использования',
      privacy: 'Политика конфиденциальности',
      contact: 'Контакты',
      support: 'Поддержка',
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
      profile: 'My Profile',
    },
    home: {
      title: 'Popular Products',
      subtitle: 'Most purchased products this week',
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
    },
    profile: {
      title: 'My Profile',
      purchaseHistory: 'Purchase History',
      noPurchases: 'You have no purchases yet',
      goToProducts: 'Go to Products',
      notAuthorized: 'You are not authorized',
      loginRequired: 'Sign in to see your purchase history',
    },
    auth: {
      email: 'Email',
      password: 'Password',
      loginTitle: 'Sign In',
      registerTitle: 'Register',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      registerNow: 'Register Now',
      loginNow: 'Sign In',
      forgotPassword: 'Forgot password?',
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
    footer: {
      categories: 'Categories',
      info: 'Information',
      about: 'About Us',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      contact: 'Contact',
      support: 'Support',
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

  useEffect(() => {
    localStorage.setItem('language', language);
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

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};