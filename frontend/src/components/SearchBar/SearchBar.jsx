import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import Spinner from '../ui/Spinner/Spinner';
import { useLanguage } from '../../context/LanguageContext';
import { SearchIcon } from '../ui/Icons';
import { formatPrice } from '../../utils/formatPrice';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      try {
        setLoading(true);
        const results = await productsAPI.search(query);
        setResults(results.slice(0, 8));
        setIsOpen(true);
      } catch (err) {
        console.error('Ошибка поиска:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleProductClick = (product) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setQuery(''), 200);
  };

  return (
    <div className="search-bar-container" style={{ position: 'relative', width: '100%' }}>
      <div className="search-bar">
        <SearchIcon size={18} />
        <input 
          type="text" 
          placeholder={t('header.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(handleClose, 200)}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(product => (
            <div 
              key={product.id} 
              className="search-result-item"
              onClick={() => handleProductClick(product)}
            >
              <img src={product.image} alt={product.name} />
              <div className="search-result-info">
                <h4>{product.name}</h4>
                <span className="search-result-price">{formatPrice(product.price)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="search-results">
          <div className="search-no-results">
            {t('productsNotFound')}
          </div>
        </div>
      )}

      {loading && (
        <div className="search-results">
          <div className="search-loading">
            <Spinner size="small" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
