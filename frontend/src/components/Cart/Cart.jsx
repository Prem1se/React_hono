import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CloseIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner/Spinner';
import CartItem from '../CartItem/CartItem';
import EmptyState from '../ui/EmptyState/EmptyState';
import LoginModal from '../LoginModal/LoginModal';
import OrderSummary from '../OrderSummary/OrderSummary';
import './Cart.css';
import './CartSidebar.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const total = getTotalPrice();

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleCartClick = () => {
    setShowSidebar(true);
  };

  if (loading) {
    return (
      <div className="content-area container">
        <div className="loading">
          <Spinner />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="content-area container">
        <EmptyState 
          icon="🛒"
          title={t('cart.empty')}
          description={t('cart.emptyDescription')}
          actionText={t('cart.continueShopping')}
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <>
      <div className="content-area container">
        <h1>{t('cart.title')}</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map(item => (
              <CartItem 
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                idField="productId"
              />
            ))}
          </div>

          <OrderSummary 
            cartItems={cartItems}
            total={total}
            showCheckoutButton={true}
            onCheckout={handleCheckout}
            t={t}
          />
        </div>
      </div>

      <div className={`cart-sidebar ${showSidebar ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h2 className="cart-sidebar-title">{t('cart.title')}</h2>
          <button className="cart-sidebar-close" onClick={toggleSidebar}>
            <CloseIcon size={24} />
          </button>
        </div>

        <div className="cart-sidebar-items">
          {cartItems.length === 0 ? (
            <div className="cart-sidebar-empty">
              <div className="cart-sidebar-empty-icon">🛒</div>
              <p className="cart-sidebar-empty-text">{t('cart.empty')}</p>
              <button 
                className="cart-sidebar-continue-btn"
                onClick={() => { setShowSidebar(false); navigate('/'); }}
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <CartItem 
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                idField="productId"
              />
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-sidebar-total">
              <span>{t('cart.total')}</span>
              <span>{total.toLocaleString()} ₽</span>
            </div>
            <button 
              className="cart-sidebar-checkout-btn"
              onClick={handleCheckout}
            >
              {t('cart.checkout')}
            </button>
          </div>
        )}
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Cart;
