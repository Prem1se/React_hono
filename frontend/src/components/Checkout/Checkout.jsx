import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Spinner from '../ui/Spinner/Spinner';
import { ordersAPI } from '../../services/api';
import LoginModal from '../LoginModal/LoginModal';
import Button from '../ui/Button/Button';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: user?.email || ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const total = getTotalPrice();

  useEffect(() => {
    if (cartItems.length === 0 && !paymentSuccess) {
      const timer = setTimeout(() => {
        navigate('/cart');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, paymentSuccess, navigate]);

  // Если гость пытается оформить заказ — показать модалку входа
  useEffect(() => {
    if (!user && cartItems.length > 0 && !paymentSuccess) {
      setShowLoginModal(true);
    }
  }, [user, cartItems.length, paymentSuccess]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.email) {
      setError('Заполните все поля');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Некорректный email');
      return;
    }

    if (cartItems.length === 0) {
      setError('Корзина пуста');
      return;
    }

    setIsProcessing(true);

    try {
      await ordersAPI.create({
        items: cartItems,
        total: total,
        customerInfo: {
          ...formData,
          email: user ? user.email : formData.email
        }
      });

      await clearCart();

      setIsProcessing(false);
      setPaymentSuccess(true);
    } catch (err) {
      console.error('Ошибка создания заказа:', err);
      setError(err.message);
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="content-area">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h1>{t('checkout.success')}</h1>
          <p>Спасибо за покупку!</p>
          <Button 
            variant="primary" 
            size="large" 
            onClick={() => navigate('/')}
            className="continue-shopping-btn"
          >
            {t('cart.continueShopping')}
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="content-area">
        <div className="loading">
          <Spinner />
        </div>
      </div>
    );
  }

  const cartItemsWithDetails = cartItems;

  return (
    <>
    <div className="content-area">
      <h1>{t('checkout.title')}</h1>
      
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>{t('checkout.contactInfo')}</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-group">
              <label>{t('checkout.fullName')} *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('checkout.phone')} *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+7 (999) 999-99-99"
                />
              </div>
              <div className="form-group">
                <label>{t('checkout.email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@mail.ru"
                />
              </div>
            </div>

            <div className="order-review">
              <h2>{t('checkout.order')}</h2>
              <div className="review-items">
                {cartItemsWithDetails.map(item => (
                  <div key={item.productId} className="review-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{((item.price || 0) * item.quantity).toFixed(0)} ₽</span>
                  </div>
                ))}
              </div>
              <div className="review-total">
                <span>{t('cart.total')}</span>
                <span>{total.toFixed(0)} ₽</span>
              </div>
            </div>

            <Button 
              type="submit"
              variant="primary"
              size="large"
              disabled={isProcessing || total === 0}
            >
              {isProcessing ? t('checkout.processing') : `${t('checkout.pay')} ${total.toFixed(0)} ₽`}
            </Button>
          </form>
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

export default Checkout;
