import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import './CategoryPage.css';

const ITEMS_PER_PAGE = 12;

const CategoryPage = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'default' // default price-asc price-desc
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getByCategory(category);
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

  const filteredProducts = products
    .filter(p => {
      const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
      return p.price >= min && p.price <= max;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      sortBy: 'default'
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || filters.sortBy !== 'default';

  if (loading) {
    return (
      <div className="content-area">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Назад
      </button>
      
      <div className="page-header">
        <h1>{t(`categories.${category}.name`)}</h1>
        <p>{t(`categories.${category}.description`)}</p>
      </div>

      <div className="category-controls">
        <button className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
          ⚙️ Фильтры {hasActiveFilters && <span className="filters-active-indicator">●</span>}
        </button>
        {hasActiveFilters && (
          <button className="filters-reset" onClick={resetFilters}>
            Сбросить
          </button>
        )}
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-row">
            <div className="filter-group">
              <label>Цена от</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => {
                  setFilters({ ...filters, minPrice: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="filter-group">
              <label>Цена до</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => {
                  setFilters({ ...filters, maxPrice: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="∞"
                min="0"
              />
            </div>
            <div className="filter-group">
              <label>Сортировка</label>
              <select
                value={filters.sortBy}
                onChange={(e) => {
                  setFilters({ ...filters, sortBy: e.target.value });
                  setCurrentPage(1);
                }}
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Сначала дешёвые</option>
                <option value="price-desc">Сначала дорогие</option>
              </select>
            </div>
          </div>
          <div className="filters-results">
            Найдено: {filteredProducts.length} из {products.length}
          </div>
        </div>
      )}

      {currentProducts.length === 0 ? (
        <div className="empty-state">
          <p>Товары не найдены</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Назад
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Вперёд →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
