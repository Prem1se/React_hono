import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './Advantages.css';

const Advantages = () => {
  const { t } = useLanguage();

  return (
    <section className="advantages-section">
      <div className="container">
        <div className="advantages-header">
          <h2>{t('advantages.title')}</h2>
          <p className="section-description">{t('advantages.subtitle')}</p>
        </div>

        <div className="advantages-grid">
          {[
            { icon: '⚡', title: t('advantages.instant'), desc: t('advantages.instantDesc'), color: 'blue' },
            { icon: '🛡️', title: t('advantages.guarantee'), desc: t('advantages.guaranteeDesc'), color: 'green' },
            { icon: '💰', title: t('advantages.benefits'), desc: t('advantages.benefitsDesc'), color: 'yellow' },
            { icon: '💬', title: t('advantages.support'), desc: t('advantages.supportDesc'), color: 'purple' },
          ].map((adv, index) => (
            <AdvantagesCard key={index} adv={adv} />
          ))}
        </div>
      </div>
    </section>
  );
};

const AdvantagesCard = memo(({ adv }) => (
  <div className={`advantage-card advantage-${adv.color}`}>
    <div className="advantage-icon">{adv.icon}</div>
    <h3 className="advantage-title">{adv.title}</h3>
    <p className="advantage-text">{adv.desc}</p>
  </div>
));

export default Advantages;
