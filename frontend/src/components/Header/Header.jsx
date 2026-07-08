import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CartIcon, MenuIcon } from '../ui/Icons';
import { formatPrice } from '../../utils/formatPrice';
import LoginModal from '../LoginModal/LoginModal';
import CategoriesDropdown from '../CategoriesDropdown/CategoriesDropdown';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems, lastAddedItem, cartPreview } = useCart();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    setShowCategories(false);
    navigate(`/category/${category}`);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const handleAdminClick = () => {
    navigate('/admin');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="logo-wrapper">
              <div 
                className="site-name"
                onClick={handleLogoClick}
              >
                SKAM
              </div>
              <div className="catalog-wrapper" onMouseLeave={() => setShowCategories(false)}>
                <button 
                  className="catalog-btn"
                  onClick={() => setShowCategories(!showCategories)}
                >
                  <MenuIcon size={18} />
                  {t('header.catalog')}
                </button>
                <CategoriesDropdown 
                  show={showCategories} 
                  onClose={() => setShowCategories(false)}
                  onCategoryClick={handleCategoryClick}
                />
              </div>
            </div>
          </div>

          <div className="header-center">
            <SearchBar />
          </div>

          <div className="header-right">
            <LanguageSelector />
            
            <div className="cart-wrapper-header">
              <button className="cart-header-btn" onClick={handleCartClick}>
                <CartIcon size={18} />
                <span>{t('header.cart')}</span>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </button>

              {cartPreview && lastAddedItem && (
                <div className="cart-preview">
                  <img src={lastAddedItem.image} alt={lastAddedItem.name} />
                  <div className="cart-preview-info">
                    <span className="cart-preview-title">{lastAddedItem.name}</span>
                    <span className="cart-preview-price">{formatPrice(lastAddedItem.price)}</span>
                    <span className="cart-preview-added">✓ Добавлено в корзину</span>
                  </div>
                  <button className="cart-preview-go" onClick={handleCartClick}>
                    Перейти →
                  </button>
                </div>
              )}
            </div>

          {user ? (
            <div className="profile-wrapper" onMouseLeave={() => setShowProfileMenu(false)}>
              <button 
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span className="profile-email">{user.email}</span>
              </button>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-inner">
                    <button onClick={handleProfileClick}>
                      {t('header.profile')}
                    </button>
                    {user.role === 'admin' && (
                      <button onClick={handleAdminClick}>
                        🛠️ Админ-панель
                      </button>
                    )}
                    <button onClick={handleLogout}>
                      {t('header.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              {t('header.login')}
            </button>
          )}
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
