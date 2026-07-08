import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import { useLanguage } from '../../context/LanguageContext';

const PopularProducts = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getPopular();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
        setError(err.message || 'Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  if (products.length === 0) {
    return (
      <div className="content-area">
        <div className="page-header">
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>
        </div>
        <div className="empty-state">
          <h2>Товары не найдены</h2>
          <p>Проверьте подключение к бэкенду</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="page-header">
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onClick={(product) => navigate(`/product/${product.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
