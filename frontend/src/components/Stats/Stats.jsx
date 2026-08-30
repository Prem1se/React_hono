import { useState, useEffect } from 'react';
import './Stats.css';

const Stats = () => {
  const [counts, setCounts] = useState({
    customers: 0,
    orders: 0,
    products: 0,
    uptime: 0
  });

  const targets = {
    customers: 10000,
    orders: 50000,
    products: 500,
    uptime: 99.9
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCounts({
        customers: Math.floor(eased * targets.customers),
        orders: Math.floor(eased * targets.orders),
        products: Math.floor(eased * targets.products),
        uptime: parseFloat((eased * targets.uptime).toFixed(1))
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">
              {counts.customers.toLocaleString()}+
            </div>
            <div className="stat-label">Довольных клиентов</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              {counts.orders.toLocaleString()}+
            </div>
            <div className="stat-label">Успешных заказов</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              {counts.products}+
            </div>
            <div className="stat-label">Товаров в каталоге</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              {counts.uptime}%
            </div>
            <div className="stat-label">Время работы</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
