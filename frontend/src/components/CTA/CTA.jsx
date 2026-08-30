import { useNavigate } from 'react-router-dom';
import './CTA.css';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="container">
        <h2>Готовы начать покупки?</h2>
        <p>Присоединяйтесь к 10,000+ довольных клиентов. Мгновенная доставка, гарантия качества и поддержка 24/7.</p>
        
        <div className="cta-buttons">
          <button 
            className="cta-btn-primary"
            onClick={() => navigate('/')}
          >
            Перейти в каталог
          </button>
          <button 
            className="cta-btn-secondary"
            onClick={() => navigate('/')}
          >
            Узнать больше
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
