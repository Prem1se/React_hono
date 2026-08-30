import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatPrice';
import Spinner from '../ui/Spinner/Spinner';
import './ProductDetail.css';

const categoryConfig = {
  games: {
    platform: 'Steam / Epic Games',
    region: 'Global',
    delivery: 'Мгновенная выдача ключа',
    warranty: 'Гарантия активации',
  },
  certificates: {
    platform: 'Мультиплатформа',
    region: 'Global',
    delivery: 'Автоматическая выдача',
    warranty: 'Гарантия работы',
  },
  software: {
    platform: 'Windows / Mac',
    region: 'RU / CIS',
    delivery: 'Ключ на email',
    warranty: 'Лицензия с поддержкой',
  },
  accounts: {
    platform: 'Все платформы',
    region: 'Global',
    delivery: 'Данные аккаунта',
    warranty: 'Полная смена данных',
  },
  subscriptions: {
    platform: 'Все устройства',
    region: 'RU / Global',
    delivery: 'Автозаполнение или ключ',
    warranty: 'Гарантия на весь срок',
  },
  other: {
    platform: '—',
    region: '—',
    delivery: 'Зависит от товара',
    warranty: 'Индивидуально',
  },
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { getCategoryName } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Товар не найден');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    try {
      await addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }, [product, quantity, addToCart]);

  const cfg = useMemo(() =>
    categoryConfig[product?.categoryId] || categoryConfig.other,
    [product]
  );

  const categoryName = useMemo(() =>
    product?.category ? getCategoryName(product.category) : '',
    [product, getCategoryName]
  );

  const oldPrice = useMemo(() =>
    product?.oldPrice || (product?.price > 1000 ? Math.round(product.price * 1.3) : null),
    [product]
  );

  const discount = useMemo(() =>
    oldPrice ? Math.round((1 - product.price / oldPrice) * 100) : null,
    [oldPrice, product?.price]
  );

  if (loading) {
    return (
      <div className="content-area container product-detail-page">
        <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
        <div className="loading"><Spinner /></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="content-area container product-detail-page">
        <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
        <div className="detail-error">
          <div className="detail-error-icon">🔍</div>
          <h2>Товар не найден</h2>
          <p>Возможно, он был удалён или никогда не существовал.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area container product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>

      <div className="detail-card">
        {/* Левая часть — изображение */}
        <div className="detail-image-section">
          <div className="detail-image-wrapper">
            <img src={product.image} alt={product.name} />
            {discount && (
              <span className="detail-discount-badge">−{discount}%</span>
            )}
          </div>

          {/* Быстрая информация под картинкой */}
          <div className="detail-quick-info">
            <div className="quick-info-item">
              <div>
                <span className="qi-label">Категория</span>
                <span className="qi-value">{categoryName}</span>
              </div>
            </div>
            <div className="quick-info-item">
              <div>
                <span className="qi-label">Выдача</span>
                <span className="qi-value">{cfg.delivery}</span>
              </div>
            </div>
            <div className="quick-info-item">
              <div>
                <span className="qi-label">Гарантия</span>
                <span className="qi-value">{cfg.warranty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Правая часть — информация */}
        <div className="detail-info-section">
          {/* Категория + название */}
          <div className="detail-header">
            <span className="detail-category-tag">{categoryName}</span>
            <h1 className="detail-title">{product.name}</h1>
          </div>

          {/* Цена */}
          <div className="detail-price-block">
            <span className="detail-price-main">{formatPrice(product.price)}</span>
            {oldPrice && (
              <span className="detail-price-old">{formatPrice(oldPrice)}</span>
            )}
          </div>

          {/* Статус наличия */}
          <div className="detail-stock">
            <span className="stock-dot"></span>
            <span>В наличии — в наличии ({product.stock} шт.)</span>
          </div>

          {/* Описание */}
          <div className="detail-description">
            <h3>Описание</h3>
            <p>{product.description}</p>
          </div>

          {/* Характеристики */}
          <div className="detail-specs">
            <h3>Характеристики</h3>
            <div className="specs-grid">
              <div className="spec-row">
                <span className="spec-label">Платформа</span>
                <span className="spec-value">{cfg.platform}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Регион</span>
                <span className="spec-value">{cfg.region}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Выдача</span>
                <span className="spec-value">{cfg.delivery}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Гарантия</span>
                <span className="spec-value">{cfg.warranty}</span>
              </div>
            </div>
          </div>

          {/* Количество + кнопка */}
          <div className="detail-actions">
            <div className="quantity-selector">
              <label>Количество</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >−</button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >+</button>
              </div>
            </div>

            <button
              className={`add-to-cart-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? '✓ Добавлено' : 'Добавить в корзину'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
