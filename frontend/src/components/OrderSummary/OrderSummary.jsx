import './OrderSummary.css';

const OrderSummary = ({ cartItems, total, showCheckoutButton = false, onCheckout, t }) => {
  return (
    <div className="cart-summary">
      <h2>{t?.('cart.total') || 'Итого'}</h2>
      <div className="summary-row">
        <span>Товары</span>
        <span>{total.toFixed(0)} ₽</span>
      </div>
      <div className="summary-total">
        <span>{t?.('cart.total') || 'Итого'}</span>
        <span>{total.toFixed(0)} ₽</span>
      </div>
      
      {showCheckoutButton && onCheckout && (
        <button 
          onClick={onCheckout}
          className="checkout-btn"
          disabled={total === 0}
        >
          {t?.('cart.checkout') || 'Оформить заказ'} →
        </button>
      )}
    </div>
  );
};

export default OrderSummary;
