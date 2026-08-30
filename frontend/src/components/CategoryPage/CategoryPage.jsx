import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import ProductCard from '../ProductCard/ProductCard';
import Spinner from '../ui/Spinner/Spinner';
import { useLanguage } from '../../context/LanguageContext';
import './CategoryPage.css';

const ITEMS_PER_PAGE = 12;

const categoryIcons = {
  games: '🎮',
  certificates: '🛡️',
  software: '💻',
  accounts: '👤',
  subscriptions: '📺',
  other: '📦',
};

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { t, getCategoryName } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = category === 'all'
          ? await productsAPI.getAll()
          : await productsAPI.getByCategory(category);
        setProducts(data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      return p.price >= min && p.price <= max;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, sortBy, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuy = async (product) => {
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const resetFilters = () => {
    setSortBy('default');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = sortBy !== 'default' || priceRange.min || priceRange.max;
  const icon = category === 'all' ? '🛒' : (categoryIcons[category] || '📦');
  const categoryLabel = category === 'all' ? 'all' : category;
  const categoryName = category === 'all' ? 'Все товары' : getCategoryName(category);
  const categoryDescription = category === 'all' ? 'Полный каталог товаров' : t(`categories.${category}.description`);

  if (loading) {
    return (
      <div className="content-area container category-page">
        <div className="loading"><Spinner /></div>
      </div>
    );
  }

  return (
    <div className="content-area container category-page">
      {/* Breadcrumb */}
      <div className="category-breadcrumb">
        <button onClick={() => navigate('/')}>Главная</button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{categoryName}</span>
      </div>

      {/* Header */}
      <div className="category-hero">
        <div className="category-hero-icon">{icon}</div>
        <div className="category-hero-text">
          <h1>{categoryName}</h1>
          <p>{categoryDescription}</p>
        </div>
        <div className="category-hero-count">
          <span className="count-number">{products.length}</span>
          <span className="count-label">товаров</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="category-toolbar">
        <div className="toolbar-left">
          {/* Мобильная кнопка фильтров */}
          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? '✕ Закрыть' : '⚙ Фильтры'}
          </button>

          {/* Сортировка */}
          <div className="sort-dropdown">
            <label>Сортировка:</label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="sort-select"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Сначала дешёвые</option>
              <option value="price-desc">Сначала дорогие</option>
              <option value="name-asc">По названию А-Я</option>
              <option value="name-desc">По названию Я-А</option>
            </select>
          </div>

          {/* Цена */}
          <div className="price-filter">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => { setPriceRange({ ...priceRange, min: e.target.value }); setCurrentPage(1); }}
              placeholder="От"
              min="0"
              className="price-input"
            />
            <span className="price-dash">—</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => { setPriceRange({ ...priceRange, max: e.target.value }); setCurrentPage(1); }}
              placeholder="До"
              min="0"
              className="price-input"
            />
          </div>
        </div>

        <div className="toolbar-right">
          {hasActiveFilters && (
            <button className="reset-filters-btn" onClick={resetFilters}>
              ✕ Сбросить
            </button>
          )}
          <span className="results-count">
            Найдено: <strong>{filteredProducts.length}</strong>
          </span>
        </div>
      </div>

      {/* Products */}
      {currentProducts.length === 0 ? (
        <div className="category-empty">
          <div className="category-empty-icon">🔍</div>
          <p>Товары не найдены</p>
          {hasActiveFilters && (
            <button className="reset-filters-btn" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {currentProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/product/${product.id}`)}
              onBuy={handleBuy}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="category-pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
