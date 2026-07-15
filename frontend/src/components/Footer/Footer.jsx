import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-section">
          <h3>{t('footer.brand')}</h3>
          <p>{t('footer.subtitle')}</p>
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
            <li>{t('footer.email')}</li>
            <li>{t('footer.telegram')}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
