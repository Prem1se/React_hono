import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSelector.css';

const languages = [
  { code: 'ru', flag: '🇷🇺' },
  { code: 'en', flag: '🇬🇧' },
];

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === language);

  return (
    <div className="language-selector" onMouseLeave={() => setIsOpen(false)}>
      <button 
        className="language-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-flag">{currentLang.flag}</span>
        <span className="language-name">{t(`languages.${language}`)}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <div className="language-dropdown-inner">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
              >
                <span className="language-flag">{lang.flag}</span>
                <span>{t(`languages.${lang.code}`)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
