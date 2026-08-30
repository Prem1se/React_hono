import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

const terminalLinesRu = [
  { type: 'new', text: 'Steam Wallet 1000 RUB — в наличии' },
  { type: 'sale', text: 'Скидка 25% на NordVPN подписку' },
  { type: 'info', text: 'Серверы работают стабильно (uptime 99.9%)' },
  { type: 'update', text: 'Добавлены Xbox Game Pass Ultimate' },
  { type: 'new', text: 'PlayStation Plus Premium — новинка' },
  { type: 'info', text: 'Поддержка онлайн 24/7' },
  { type: 'sale', text: 'Акция: Microsoft Office 2021 −30%' },
  { type: 'update', text: 'Обновлён каталог VPN-сервисов' },
];

const terminalLinesEn = [
  { type: 'new', text: 'Steam Wallet 1000 RUB — in stock' },
  { type: 'sale', text: '25% off NordVPN subscription' },
  { type: 'info', text: 'Servers running stably (uptime 99.9%)' },
  { type: 'update', text: 'Xbox Game Pass Ultimate added' },
  { type: 'new', text: 'PlayStation Plus Premium — new' },
  { type: 'info', text: 'Online support 24/7' },
  { type: 'sale', text: 'Sale: Microsoft Office 2021 −30%' },
  { type: 'update', text: 'VPN services catalog updated' },
];

const labelClasses = {
  new: 'label-new',
  sale: 'label-sale',
  info: 'label-info',
  update: 'label-update',
};

const labelTextsRu = {
  new: 'НОВИНКА',
  sale: 'АКЦИЯ',
  update: 'ОБНОВЛЕНИЕ',
  info: 'INFO',
};

const labelTextsEn = {
  new: 'NEW',
  sale: 'SALE',
  update: 'UPDATE',
  info: 'INFO',
};

const typeLine = async (line, index, getLines, setLines) => {
  let current = '';
  for (let i = 0; i < line.text.length; i++) {
    current += line.text[i];
    setLines(prev => {
      const next = [...prev];
      next[index] = { ...line, text: current };
      return next;
    });
    await new Promise(r => setTimeout(r, 25));
  }
  setLines(prev => {
    const next = [...prev];
    next[index] = { ...line, text: line.text };
    return next;
  });
};

const Hero = () => {
  const { t, language } = useLanguage();
  const [lines, setLines] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const labelTexts = language === 'en' ? labelTextsEn : labelTextsRu;
  const terminalLines = language === 'en' ? terminalLinesEn : terminalLinesRu;

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      for (let i = 0; i < terminalLines.length; i++) {
        if (cancelled) return;
        setActiveIndex(i);
        await typeLine(terminalLines[i], i, () => lines, setLines);
        await new Promise(r => setTimeout(r, 400));
      }
      setActiveIndex(-1);
    };

    run();

    return () => { cancelled = true; };
  }, [language]);

  const titlePart1 = t('hero.titlePart1');
  const titlePart2 = t('hero.titlePart2');
  const subtitle = t('hero.subtitle');

  return (
    <div className="hero">
      <div className="hero-content">
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot terminal-dot-red"></span>
              <span className="terminal-dot terminal-dot-yellow"></span>
              <span className="terminal-dot terminal-dot-green"></span>
            </div>
            <div className="terminal-title">skam@shop:~</div>
          </div>
          <div className="terminal-body">
            {lines.map((line, index) => (
              <div key={index} className={`terminal-line ${index === activeIndex ? 'typing' : ''}`}>
                <span className={`terminal-label ${labelClasses[line.type]}`}>
                  [{labelTexts[line.type]}]
                </span>
                <span className="terminal-text">{line.text}</span>
              </div>
            ))}
            <div className={`terminal-cursor ${lines.length > 0 ? 'active' : ''}`}>▊</div>
          </div>
        </div>

        <h1 className="hero-title">
          {titlePart1} <span className="hero-title-gradient">{titlePart2}</span>
        </h1>

        <p className="hero-subtitle">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Hero;
