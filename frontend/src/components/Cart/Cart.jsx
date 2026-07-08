import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import CartItem from '../CartItem/CartItem';
import EmptyState from '../ui/EmptyState/EmptyState';
import LoginModal from '../LoginModal/LoginModal';
import OrderSummary from '../OrderSummary/OrderSummary';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const total = getTotalPrice();

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="content-area">
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
      <div className="content-area">
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

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default Cart;
