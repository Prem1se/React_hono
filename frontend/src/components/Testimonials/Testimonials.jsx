import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Александр М.',
      role: 'Постоянный клиент',
      text: 'Отличный сервис! Покупаю уже полгода, все товары приходят мгновенно. Поддержка отвечает за пару минут.',
      rating: 5,
      avatar: 'А'
    },
    {
      name: 'Екатерина В.',
      role: 'Фрилансер',
      text: 'Очень удобный магазин. Цены ниже чем у конкурентов, а качество на высоте. Рекомендую всем!',
      rating: 5,
      avatar: 'Е'
    },
    {
      name: 'Дмитрий К.',
      role: 'Разработчик',
      text: 'Использую для работы. Быстрая доставка, гарантия качества. Единственный минус — хотелось бы больше способов оплаты.',
      rating: 4,
      avatar: 'Д'
    },
    {
      name: 'Мария С.',
      role: 'Дизайнер',
      text: 'Прекрасный опыт покупок! Бонусная программа реально работает, уже получила скидку 15%.',
      rating: 5,
      avatar: 'М'
    },
    {
      name: 'Артём Л.',
      role: 'Предприниматель',
      text: 'Закупаемся оптом для команды. Отличные условия для постоянных клиентов, быстрая обработка заказов.',
      rating: 5,
      avatar: 'А'
    },
    {
      name: 'Ольга Н.',
      role: 'Маркетолог',
      text: 'Широкий ассортимент, всегда нахожу что нужно. Интерфейс удобный, всё понятно с первого раза.',
      rating: 4,
      avatar: 'О'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2>Отзывы наших клиентов</h2>
          <p className="section-description">
            Более 10 000 довольных клиентов по всей России
          </p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? 'star filled' : 'star empty'}>
                    ★
                  </span>
                ))}
              </div>
              
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
