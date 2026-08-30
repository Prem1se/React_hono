import { useLanguage } from '../../context/LanguageContext';
import './OrderSummary.css';

const OrderSummary = ({ cartItems, total, showCheckoutButton = false, onCheckout, t }) => {
  const { t: tContext } = useLanguage();
  const translate = t || tContext;
  
  return (
    <div className="cart-summary">
      <h2>{translate('cart.total')}</h2>
      <div className="summary-row">
        <span>{translate('cart.items')}</span>
        <span>{total.toFixed(0)} ₽</span>
      </div>
      <div className="summary-total">
        <span>{translate('cart.total')}</span>
        <span>{total.toFixed(0)} ₽</span>
      </div>
      
      {showCheckoutButton && onCheckout && (
        <button 
          onClick={onCheckout}
          className="checkout-btn"
          disabled={total === 0}
        >
          {translate('cart.checkout')} →
        </button>
      )}
    </div>
  );
};

export default OrderSummary;
