import { memo } from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { useLanguage } from '../../context/LanguageContext';
import './ProductCard.css';

const categoryConfig = {
  games: { platform: 'Steam / Epic', duration: 'Навсегда', region: 'Global', warranty: 'Есть' },
  certificates: { platform: 'Multi-platform', duration: '1–12 мес', region: 'Global', warranty: 'Есть' },
  software: { platform: 'Windows / Mac', duration: '1 год+', region: 'RU/CIS', warranty: 'Есть' },
  accounts: { platform: 'Все платформы', duration: 'Навсегда', region: 'Global', warranty: 'Есть' },
  subscriptions: { platform: 'Все устройства', duration: '1–12 мес', region: 'RU/Global', warranty: 'Есть' },
  other: { platform: '—', duration: '—', region: '—', warranty: 'Есть' },
};

const ProductCard = memo(({ product, onClick, onBuy }) => {
  const { getCategoryName } = useLanguage();
  const cfg = categoryConfig[product.categoryId] || categoryConfig.other;
  const categoryName = getCategoryName(product.category);
  const oldPrice = product.oldPrice || (product.price > 1000 ? Math.round(product.price * 1.3) : null);
  const discount = oldPrice ? Math.round((1 - product.price / oldPrice) * 100) : null;

  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="product-card-glow"></div>

      <div className="product-card-top">
        <div className="product-card-cat">{categoryName}</div>
        {discount && <span className="product-card-discount">−{discount}%</span>}
      </div>

      <h3 className="product-card-name">{product.name}</h3>

      <div className="product-card-specs">
        <div className="spec-block">
          <span className="spec-icon">🖥</span>
          <div className="spec-text">
            <span className="spec-label">Платформа</span>
            <span className="spec-value">{cfg.platform}</span>
          </div>
        </div>
        <div className="spec-block">
          <span className="spec-icon">⏱</span>
          <div className="spec-text">
            <span className="spec-label">Срок</span>
            <span className="spec-value">{cfg.duration}</span>
          </div>
        </div>
        <div className="spec-block">
          <span className="spec-icon">🌍</span>
          <div className="spec-text">
            <span className="spec-label">Регион</span>
            <span className="spec-value">{cfg.region}</span>
          </div>
        </div>
        <div className="spec-block">
          <span className="spec-icon">✓</span>
          <div className="spec-text">
            <span className="spec-label">Гарантия</span>
            <span className="spec-value">{cfg.warranty}</span>
          </div>
        </div>
      </div>

      <div className="product-card-footer">
        <div className="product-card-prices">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {oldPrice && <span className="product-card-old-price">{formatPrice(oldPrice)}</span>}
        </div>
        <button
          className="product-card-buy"
          onClick={(e) => {
            e.stopPropagation();
            if (onBuy) onBuy(product);
          }}
        >
          В корзину
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
