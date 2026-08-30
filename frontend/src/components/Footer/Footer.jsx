import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t, getCategoryName } = useLanguage();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-text">SKAM</span>
          </div>
          <p>{t('footer.subtitle')}</p>
          <div className="footer-social">
            <a href="#" onClick={(e) => e.preventDefault()} title="Telegram">TG</a>
            <a href="#" onClick={(e) => e.preventDefault()} title="Email">EM</a>
            <a href="#" onClick={(e) => e.preventDefault()} title="Discord">DC</a>
            <a href="#" onClick={(e) => e.preventDefault()} title="VK">VK</a>
          </div>
        </div>

        <div className="footer-column">
          <h3>{t('footer.categories')}</h3>
          <ul className="footer-links">
            <li><a onClick={() => navigate('/category/games')}>{getCategoryName('games')}</a></li>
            <li><a onClick={() => navigate('/category/certificates')}>{getCategoryName('certificates')}</a></li>
            <li><a onClick={() => navigate('/category/software')}>{getCategoryName('software')}</a></li>
            <li><a onClick={() => navigate('/category/accounts')}>{getCategoryName('accounts')}</a></li>
            <li><a onClick={() => navigate('/category/subscriptions')}>{getCategoryName('subscriptions')}</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>{t('footer.info')}</h3>
          <ul className="footer-links">
            <li><a onClick={() => scrollToSection('how-section')}>{t('footer.about')}</a></li>
            <li><a onClick={() => scrollToSection('faq')}>FAQ</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>{t('footer.terms')}</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>{t('footer.privacy')}</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>{t('footer.support')}</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => e.preventDefault()}>{t('footer.email')}</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>{t('footer.telegram')}</a></li>
          </ul>
          <div className="footer-payments">
            <span className="footer-payment">Visa</span>
            <span className="footer-payment">MC</span>
            <span className="footer-payment">MIR</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>{t('footer.copyright')}</p>
        <p className="footer-made">Designed for digital excellence</p>
      </div>
    </footer>
  );
};

export default Footer;
