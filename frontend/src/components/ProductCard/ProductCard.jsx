import { formatPrice } from '../../utils/formatPrice';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        {product.sales && (
          <p className="product-sales">🔥 {product.sales} покупок</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
