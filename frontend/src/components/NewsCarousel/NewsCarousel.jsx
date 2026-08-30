import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './NewsCarousel.css';

const newsDataRu = [
  {
    date: '22 авг 2025',
    category: 'Новинка',
    title: 'Добавлены ключи Steam для новых релизов',
    description: 'Cyberpunk 2077, Elden Ring, Baldur\'s Gate 3 и другие хиты теперь в каталоге по выгодным ценам.',
    color: 'blue',
  },
  {
    date: '20 авг 2025',
    category: 'Акция',
    title: 'Скидки до 40% на VPN-сервисы',
    description: 'NordVPN, ExpressVPN и Surfshark со скидкой. Защитите своё соединение по выгодной цене.',
    color: 'green',
  },
  {
    date: '18 авг 2025',
    category: 'Обновление',
    title: 'Microsoft Office 2021 пополнил каталог',
    description: 'Полный пакет Office для Windows и Mac. Мгновенная активация, официальная лицензия.',
    color: 'purple',
  },
  {
    date: '15 авг 2025',
    category: 'Новинка',
    title: 'Xbox Game Pass Ultimate доступен',
    description: 'Доступ к сотням игр на Xbox и ПК. Подписка на 1, 3 и 6 месяцев в наличии.',
    color: 'blue',
  },
  {
    date: '12 авг 2025',
    category: 'Акция',
    title: 'Spotify Premium −30% для новых клиентов',
    description: 'Музыка без рекламы, оффлайн прослушивание. Специальная цена для первых 100 покупателей.',
    color: 'green',
  },
];

const newsDataEn = [
  {
    date: 'Aug 22 2025',
    category: 'New',
    title: 'Steam keys added for new releases',
    description: 'Cyberpunk 2077, Elden Ring, Baldur\'s Gate 3 and other hits now in the catalog at great prices.',
    color: 'blue',
  },
  {
    date: 'Aug 20 2025',
    category: 'Sale',
    title: 'Up to 40% off VPN services',
    description: 'NordVPN, ExpressVPN and Surfshark on sale. Protect your connection at a great price.',
    color: 'green',
  },
  {
    date: 'Aug 18 2025',
    category: 'Update',
    title: 'Microsoft Office 2021 added to catalog',
    description: 'Full Office package for Windows and Mac. Instant activation, official license.',
    color: 'purple',
  },
  {
    date: 'Aug 15 2025',
    category: 'New',
    title: 'Xbox Game Pass Ultimate available',
    description: 'Access to hundreds of games on Xbox and PC. 1, 3 and 6 month subscriptions in stock.',
    color: 'blue',
  },
  {
    date: 'Aug 12 2025',
    category: 'Sale',
    title: 'Spotify Premium −30% for new customers',
    description: 'Music without ads, offline listening. Special price for the first 100 buyers.',
    color: 'green',
  },
];

const NewsCarousel = () => {
  const { language } = useLanguage();
  const newsData = language === 'en' ? newsDataEn : newsDataRu;
  
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % newsData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, newsData.length]);

  const goToSlide = useCallback((index) => {
    setCurrent(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  }, []);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % newsData.length);
  }, [newsData.length]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + newsData.length) % newsData.length);
  }, [newsData.length]);

  const activeNews = useMemo(() => newsData[current], [current, newsData]);

  return (
    <section className="news-section">
      <div className="container">
        <div className="news-header">
          <h2>Новости и обновления</h2>
          <p className="section-description">Последние новости магазина, акции и обновления каталога</p>
        </div>

        <div className="news-carousel">
          <button className="news-arrow news-arrow-prev" onClick={prev}>←</button>

          <div className="news-track">
            {newsData.map((news, index) => (
              <div
                key={index}
                className={`news-card ${index === current ? 'active' : ''} ${news.color}`}
              >
                <div className="news-card-date">{news.date}</div>
                <div className={`news-card-category news-cat-${news.color}`}>{news.category}</div>
                <h3 className="news-card-title">{news.title}</h3>
                <p className="news-card-text">{news.description}</p>
                <button className="news-card-btn">Подробнее →</button>
              </div>
            ))}
          </div>

          <button className="news-arrow news-arrow-next" onClick={next}>→</button>
        </div>

        <div className="news-dots">
          {newsData.map((_, index) => (
            <button
              key={index}
              className={`news-dot ${index === current ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsCarousel;
