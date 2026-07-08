import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

const PopularProducts = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [popularProducts, setPopularProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [popular, all] = await Promise.all([
          productsAPI.getPopular(),
          productsAPI.getAll()
        ]);
        setPopularProducts(popular);
        // Исключаем популярные товары из списка "Все товары"
        const popularIds = new Set(popular.map(p => p.id));
        setAllProducts(all.filter(p => !popularIds.has(p.id)));
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
      <div className="content-area">
        <div className="page-header">
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
        </div>
        <div className="loading">Загрузка товаров...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-area">
        <div className="page-header">
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
        </div>
        <div className="error-message">
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <p>Проверьте, что бэкенд запущен: <code>http://localhost:3000</code></p>
          <button 
            onClick={() => window.location.reload()} 
            className="continue-shopping-btn"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Рекомендованные товары */}
      {popularProducts.length > 0 && (
        <div className="section-card">
          <div className="page-header">
            <h1>Рекомендованные товары</h1>
          </div>

          <div className="products-grid">
            {popularProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={(product) => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Все товары */}
      <div className="section-card">
        <div className="page-header">
          <h1>Все товары</h1>
        </div>

        <div className="products-grid">
          {allProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onClick={(product) => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;
