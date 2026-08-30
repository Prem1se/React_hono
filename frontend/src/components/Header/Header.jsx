import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CartIcon, MenuIcon, AdminBadgeIcon } from '../ui/Icons';
import { formatPrice } from '../../utils/formatPrice';
import LoginModal from '../LoginModal/LoginModal';
import CategoriesDropdown from '../CategoriesDropdown/CategoriesDropdown';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems, lastAddedItem, cartPreview } = useCart();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => navigate('/');

  const handleCategoryClick = (category) => {
    setShowCategories(false);
    navigate(`/category/${category}`);
  };

  const handleCartClick = () => navigate('/cart');

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

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If element not found, we're on another page — navigate home first
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div className="site-name" onClick={handleLogoClick}>
              <span className="site-name-text">SKAM</span>
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

          <nav className="header-nav">
            <button className="nav-link" onClick={() => scrollToSection('products-section')}>
              {t('header.services')}
            </button>
            <button className="nav-link" onClick={() => scrollToSection('faq')}>
              FAQ
            </button>
            <button className="nav-link" onClick={() => scrollToSection('footer')}>
              {t('header.contacts')}
            </button>
          </nav>

          <div className="header-right">
            <LanguageSelector />

            <div className="cart-wrapper-header">
              <button className="cart-header-btn" onClick={handleCartClick}>
                <CartIcon size={18} />
                <span className="cart-header-label">{t('header.cart')}</span>
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
                    <span className="cart-preview-added">{t('product.added')}</span>
                  </div>
                  <button className="cart-preview-go" onClick={handleCartClick}>
                    {t('header.goToCart')}
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="profile-wrapper">
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
                  <div
                    className="profile-dropdown"
                    onMouseEnter={() => setShowProfileMenu(true)}
                    onMouseLeave={() => setShowProfileMenu(false)}
                  >
                    <div className="profile-dropdown-inner">
                      <button onClick={handleProfileClick}>
                        {t('header.profile')}
                      </button>
                      {user.role === 'admin' && (
                        <button onClick={handleAdminClick}>
                          <AdminBadgeIcon size={16} /> {t('admin.panel')}
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
                <span className="login-btn-icon">{t('header.userIcon')}</span>
                {t('header.login')}
              </button>
            )}

            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button className="mobile-nav-link" onClick={() => scrollToSection('products-section')}>{t('header.services')}</button>
            <button className="mobile-nav-link" onClick={() => scrollToSection('faq')}>FAQ</button>
            <button className="mobile-nav-link" onClick={() => scrollToSection('footer')}>{t('header.contacts')}</button>
          </div>
        )}
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
