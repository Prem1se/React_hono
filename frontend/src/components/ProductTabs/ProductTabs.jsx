import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import ProductCard from '../ProductCard/ProductCard';
import Spinner from '../ui/Spinner/Spinner';
import './ProductTabs.css';

const tabs = [
  { key: 'all', labelKey: 'tab.all' },
  { key: 'games', labelKey: 'tab.games' },
  { key: 'certificates', labelKey: 'tab.certificates' },
  { key: 'software', labelKey: 'tab.software' },
  { key: 'accounts', labelKey: 'tab.accounts' },
  { key: 'subscriptions', labelKey: 'tab.subscriptions' },
];

const ProductTabs = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, getCategoryName } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() =>
    activeTab === 'all'
      ? products
      : products.filter(p => p.category === activeTab),
    [products, activeTab]
  );

  const handleBuy = useCallback(async (product) => {
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  }, [addToCart]);

  const displayProducts = useMemo(() => filtered.slice(0, 8), [filtered]);

  const hasProducts = displayProducts.length > 0;

  return (
    <section className="product-tabs-section" id="products-section">
      <div className="container">
        <div className="products-card">
          <div className="product-tabs-header">
            <h2>{t('productTabs.title')}</h2>
            <p className="section-description">
              {t('productTabs.description')}
            </p>
          </div>

          <div className="product-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`product-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="product-tab-label">{t(tab.labelKey)}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading"><Spinner /></div>
          ) : !hasProducts ? (
            <div className="product-tabs-empty">
              <p>{t('productTabs.noProducts')}</p>
            </div>
          ) : (
            <div className="products-grid">
              {displayProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={(p) => navigate(`/product/${p.id}`)}
                  onBuy={handleBuy}
                />
              ))}
            </div>
          )}

          <div className="product-tabs-footer">
            <button className="view-all-btn" onClick={() => navigate(`/category/all`)}>
              {t('productTabs.viewAll')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
