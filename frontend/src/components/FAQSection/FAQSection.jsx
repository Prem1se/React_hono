import { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './FAQSection.css';

const faqsRu = [
  {
    q: 'Как быстро я получу товар после оплаты?',
    a: 'В большинстве случаев товар выдаётся автоматически сразу после оплаты — в течение 1–2 минут. Вы получите ключ или данные на email и в личном кабинете.',
  },
  {
    q: 'Что делать если товар не работает?',
    a: 'Мы предоставляем гарантию на все товары. Если возникла проблема — обратитесь в поддержку через Telegram или email, и мы заменим товар или вернём средства в течение 30 дней.',
  },
  {
    q: 'Какие способы оплаты доступны?',
    a: 'Мы принимаем банковские карты (Visa, MasterCard, МИР), электронные кошельки и другие способы. Все платежи защищены SSL-шифрованием.',
  },
  {
    q: 'Можно ли вернуть товар?',
    a: 'Возврат возможен, если товар оказался неисправным и мы не смогли его заменить. Возврат средств осуществляется на тот же способ оплаты в течение 3–5 рабочих дней.',
  },
  {
    q: 'Безопасно ли покупать у вас?',
    a: 'Да, мы работаем уже более 3 лет, более 10 000 довольных клиентов. Все данные защищены, мы не передаём информацию третьим лицам.',
  },
  {
    q: 'Есть ли скидки для постоянных клиентов?',
    a: 'Да, у нас работает бонусная программа. С каждой покупки начисляется кешбэк, который можно использовать для скидок до 15% на следующие заказы.',
  },
];

const faqsEn = [
  {
    q: 'How quickly will I receive the product after payment?',
    a: 'In most cases, the product is delivered automatically immediately after payment — within 1–2 minutes. You will receive the key or data via email and in your personal account.',
  },
  {
    q: 'What if the product does not work?',
    a: 'We provide a guarantee on all products. If you encounter a problem — contact support via Telegram or email, and we will replace the product or refund your money within 30 days.',
  },
  {
    q: 'What payment methods are available?',
    a: 'We accept bank cards (Visa, MasterCard, MIR), e-wallets and other methods. All payments are protected by SSL encryption.',
  },
  {
    q: 'Can I return the product?',
    a: 'Returns are possible if the product is defective and we were unable to replace it. Refunds are made to the same payment method within 3-5 business days.',
  },
  {
    q: 'Is it safe to buy from you?',
    a: 'Yes, we have been operating for over 3 years with more than 10,000 satisfied customers. All data is protected, we do not share information with third parties.',
  },
  {
    q: 'Are there discounts for regular customers?',
    a: 'Yes, we have a bonus program. Cashback is credited with each purchase, which can be used for discounts of up to 15% on future orders.',
  },
];

const statsRu = [
  { value: '500+', label: 'Товаров в каталоге' },
  { value: '10K+', label: 'Довольных клиентов' },
  { value: '99.9%', label: 'Время работы сервисов' },
  { value: '24/7', label: 'Поддержка онлайн' },
  { value: '3 года', label: 'На рынке' },
  { value: '50K+', label: 'Выполненных заказов' },
];

const statsEn = [
  { value: '500+', label: 'Products in catalog' },
  { value: '10K+', label: 'Satisfied customers' },
  { value: '99.9%', label: 'Service uptime' },
  { value: '24/7', label: 'Online support' },
  { value: '3 years', label: 'On the market' },
  { value: '50K+', label: 'Orders completed' },
];

const FAQSection = () => {
  const { language } = useLanguage();
  const faqs = language === 'en' ? faqsEn : faqsRu;
  const stats = language === 'en' ? statsEn : statsRu;
  
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = useCallback((index) => {
    setOpenIndex(prev => prev === index ? -1 : index);
  }, []);

  const activeIndex = useMemo(() => openIndex === -1 ? null : openIndex, [openIndex]);

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-header">
          <h2>FAQ и информация</h2>
          <p className="section-description">Ответы на частые вопросы и полезная информация</p>
        </div>

        <div className="faq-grid">
          <div className="faq-accordion">
            <h3 className="faq-col-title">Частые вопросы</h3>
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeIndex === index ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => handleToggle(index)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-stats">
            <h3 className="faq-col-title">Полезная информация</h3>
            <div className="faq-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="faq-stat-card">
                  <div className="faq-stat-value">{stat.value}</div>
                  <div className="faq-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="faq-contact">
              <p>Не нашли ответ? Напишите нам:</p>
              <div className="faq-contact-btns">
                <a href="#" onClick={(e) => e.preventDefault()} className="faq-contact-btn telegram">Telegram</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="faq-contact-btn email">Email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
