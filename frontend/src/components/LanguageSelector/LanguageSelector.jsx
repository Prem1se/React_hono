import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSelector.css';

const languages = [
  { code: 'ru', name: 'RU' },
  { code: 'en', name: 'EN' },
];

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="language-selector" onMouseLeave={() => setIsOpen(false)}>
      <button 
        className="language-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="language-code">{languages.find(lang => lang.code === language)?.name}</span>
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
                <span className="language-code">{lang.name}</span>
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
