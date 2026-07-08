import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { productsAPI } from '../../services/api';
import LoginModal from '../LoginModal/LoginModal';
import Button from '../ui/Button/Button';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(parseInt(id));
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Ошибка загрузки товара:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      await addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
    }
  };

  if (loading) {
    return (
      <div className="content-area">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← {t('product.back')}
        </button>
        <div className="loading">Загрузка товара...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="content-area">
        <div className="error-message">
          <h2>Товар не найден</h2>
          <p>{error || 'Произошла ошибка при загрузке товара'}</p>
          <Button onClick={() => navigate('/')} variant="primary">
            {t('product.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="content-area">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← {t('product.back')}
        </button>

        <div className="product-detail">
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-detail-info">
            <div className="product-category-tag">{product.category}</div>
            <h1>{product.name}</h1>
            <div className="product-price-large">{product.price} ₽</div>
            
            <div className="product-description">
              <h3>{t('product.description')}</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-specs">
              <div className="spec-item">
                <span>Артикул:</span>
                <strong>{product.id}</strong>
              </div>
              <div className="spec-item">
                <span>Наличие:</span>
                <strong className="in-stock">{t('product.inStock')}</strong>
              </div>
            </div>

            <div className="quantity-selector">
              <label>{t('product.quantity')}</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
            >
              {addedToCart ? t('product.added') : t('product.addToCart')}
            </button>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default ProductDetail;
