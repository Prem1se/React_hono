import { MinusIcon, PlusIcon, TrashIcon } from '../ui/Icons';
import { formatPrice } from '../../utils/formatPrice';
import { useLanguage } from '../../context/LanguageContext';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove, idField = 'id' }) => {
  const { t } = useLanguage();
  const itemId = item[idField];
  
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p className="item-price">{formatPrice(item.price)}</p>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}>
          <MinusIcon size={14} />
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}>
          <PlusIcon size={14} />
        </button>
      </div>
      <div className="cart-item-total">
        {formatPrice(item.price * item.quantity)}
      </div>
      <button className="remove-item" onClick={() => onRemove(itemId)}>
        <TrashIcon size={16} />
      </button>
    </div>
  );
};

export default CartItem;
