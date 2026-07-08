import { useLanguage } from '../../context/LanguageContext';
import './CategoriesDropdown.css';

const categoryIcons = {
  certificates: '🌐',
  accounts: '🎮',
  software: '💿',
  games: '🎮',
  subscriptions: '📺',
  other: '📦'
};

const CategoriesDropdown = ({ show, onCategoryClick }) => {
  const { t } = useLanguage();

  if (!show) return null;

  const categoryKeys = ['certificates', 'accounts', 'software', 'games', 'subscriptions', 'other'];

  return (
    <div className="categories-dropdown">
      <div className="categories-dropdown-inner">
        <div className="categories-grid">
          {categoryKeys.map(key => (
            <div 
              key={key} 
              className="category-item"
              onClick={() => onCategoryClick(key)}
            >
              <div className="category-icon">{categoryIcons[key]}</div>
              <div className="category-info">
                <h4>{t(`categories.${key}.name`)}</h4>
                <p>{t(`categories.${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesDropdown;
