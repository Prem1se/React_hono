import { formatPrice } from '../../utils/formatPrice';
import './PurchaseItem.css';

const PurchaseItem = ({ purchase }) => {
  const date = new Date(purchase.createdAt).toLocaleString('ru-RU');
  
  return (
    <div className="purchase-item">
      <div className="purchase-header">
        <span className="purchase-date">{date}</span>
        <span className="purchase-total">Итого: {formatPrice(purchase.total)}</span>
      </div>
      <div className="purchase-products">
        {purchase.items.map((item, index) => (
          <div key={index} className="purchase-product">
            <img src={item.image} alt={item.name} />
            <div className="purchase-product-info">
              <span className="purchase-product-name">{item.name}</span>
              <span className="purchase-product-qty">× {item.quantity}</span>
            </div>
            <span className="purchase-product-price">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseItem;
