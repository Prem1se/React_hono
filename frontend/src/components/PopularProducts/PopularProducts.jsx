import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import Spinner from '../ui/Spinner/Spinner';
import Hero from '../Hero/Hero';
import ProductTabs from '../ProductTabs/ProductTabs';
import NewsCarousel from '../NewsCarousel/NewsCarousel';
import Advantages from '../Advantages/Advantages';
import HowItWorks from '../HowItWorks/HowItWorks';
import FAQSection from '../FAQSection/FAQSection';
import { useLanguage } from '../../context/LanguageContext';

const PopularProducts = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await productsAPI.getAll();
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        setError(err.message || 'Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="content-area landing-page">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="static-hero">
          <h1 className="hero-title">
            {t('hero.titlePart1')} <span className="hero-title-gradient">{t('hero.titlePart2')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
        </div>
        <div className="loading">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area landing-page">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="static-hero">
          <h1 className="hero-title">
            {t('hero.titlePart1')} <span className="hero-title-gradient">{t('hero.titlePart2')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
        </div>
        <div className="error-message">
          <h2>{t('popular.errorTitle')}</h2>
          <p>{error}</p>
          <p>{t('popular.checkBackend')}</p>
          <button
            onClick={() => window.location.reload()}
            className="continue-shopping-btn"
          >
            {t('popular.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area landing-page">
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-orb hero-orb-3"></div>
      <Hero />
      <ProductTabs />
      <Advantages />
      <HowItWorks />
      <NewsCarousel />
      <FAQSection />
    </div>
  );
};

export default PopularProducts;
