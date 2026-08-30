import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Мгновенная доставка',
      description: 'Получите товар сразу после оплаты. Автоматическая выдача 24/7 без ожидания.',
      color: 'var(--accent-cyan)'
    },
    {
      icon: '🛡️',
      title: 'Гарантия качества',
      description: 'Все товары проходят проверку. Гарантия замены в течение 30 дней.',
      color: 'var(--accent-green)'
    },
    {
      icon: '💬',
      title: 'Поддержка 24/7',
      description: 'Наша команда всегда на связи. Среднее время ответа — 5 минут.',
      color: 'var(--primary-light)'
    },
    {
      icon: '🔒',
      title: 'Безопасные платежи',
      description: 'SSL шифрование и защита данных. Принимаем все способы оплаты.',
      color: 'var(--accent-purple)'
    },
    {
      icon: '🎁',
      title: 'Бонусная программа',
      description: 'Получайте кешбэк с каждой покупки. Накопительные скидки до 15%.',
      color: 'var(--accent-orange)'
    },
    {
      icon: '📦',
      title: 'Широкий ассортимент',
      description: 'Более 500 товаров в каталоге. Новые позиции каждую неделю.',
      color: 'var(--accent-pink)'
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-header">
          <h2>Почему выбирают нас</h2>
          <p className="section-description">
            Мы создали лучший опыт покупок цифровых товаров с гарантией качества и моментальной доставкой
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
