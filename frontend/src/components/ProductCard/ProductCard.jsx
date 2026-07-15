import { formatPrice } from '../../utils/formatPrice';
import { useLanguage } from '../../context/LanguageContext';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  const { t } = useLanguage();
  
  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        {product.sales && (
          <p className="product-sales">{t('product.sales')} {product.sales}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
