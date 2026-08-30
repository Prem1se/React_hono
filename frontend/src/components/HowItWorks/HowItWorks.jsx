import { memo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './HowItWorks.css';

const HowStep = memo(({ step, index, steps }) => (
  <div className="how-step">
    <div className="how-step-num">{step.num}</div>
    <div className="how-step-icon">{step.icon}</div>
    <h3 className="how-step-title">{step.title}</h3>
    <p className="how-step-text">{step.description}</p>
    {index < steps.length - 1 && <div className="how-step-line"></div>}
  </div>
));

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { num: '01', title: t('how.step1title'), description: t('how.step1desc'), icon: '🔍' },
    { num: '02', title: t('how.step2title'), description: t('how.step2desc'), icon: '🛒' },
    { num: '03', title: t('how.step3title'), description: t('how.step3desc'), icon: '⚡' },
    { num: '04', title: t('how.step4title'), description: t('how.step4desc'), icon: '🎉' },
  ];

  return (
    <section className="how-section">
      <div className="container">
        <div className="how-header">
          <h2>{t('how.title')}</h2>
          <p className="section-description">{t('how.subtitle')}</p>
        </div>

        <div className="how-grid">
          {steps.map((step, index) => (
            <HowStep key={index} step={step} index={index} steps={steps} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
