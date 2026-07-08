import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-section">
          <h3>SKAM</h3>
          <p>Цифровые товары и услуги</p>
        </div>

        <div className="footer-section">
          <h4>{t('footer.categories')}</h4>
          <ul>
            <li>{t('categories.certificates.name')}</li>
            <li>{t('categories.accounts.name')}</li>
            <li>{t('categories.software.name')}</li>
            <li>{t('categories.games.name')}</li>
            <li>{t('categories.subscriptions.name')}</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t('footer.info')}</h4>
          <ul>
            <li>{t('footer.about')}</li>
            <li>{t('footer.terms')}</li>
            <li>{t('footer.privacy')}</li>
            <li>{t('footer.contact')}</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>{t('footer.support')}</h4>
          <ul>
            <li>support@skam.com</li>
            <li>Telegram: @skam_support</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 SKAM. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
