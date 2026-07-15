import { useLanguage } from '../../context/LanguageContext';
import { CategoryCertificatesIcon, CategoryAccountsIcon, CategorySoftwareIcon, CategoryGamesIcon, CategorySubscriptionsIcon, CategoryOtherIcon } from '../ui/Icons';
import './CategoriesDropdown.css';

const CategoryIcons = {
  certificates: CategoryCertificatesIcon,
  accounts: CategoryAccountsIcon,
  software: CategorySoftwareIcon,
  games: CategoryGamesIcon,
  subscriptions: CategorySubscriptionsIcon,
  other: CategoryOtherIcon
};

const CategoriesDropdown = ({ show, onCategoryClick }) => {
  const { t } = useLanguage();

  if (!show) return null;

  const categoryKeys = ['certificates', 'accounts', 'software', 'games', 'subscriptions', 'other'];

  return (
    <div className="categories-dropdown">
      <div className="categories-dropdown-inner">
        <div className="categories-grid">
          {categoryKeys.map(key => {
            const IconComponent = CategoryIcons[key];
            return (
              <div 
                key={key} 
                className="category-item"
                onClick={() => onCategoryClick(key)}
              >
                <div className="category-icon">
                  <IconComponent size={24} />
                </div>
                <div className="category-info">
                  <h4>{t(`categories.${key}.name`)}</h4>
                  <p>{t(`categories.${key}.description`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesDropdown;
