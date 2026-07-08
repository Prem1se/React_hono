import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import ProductsAdmin from './ProductsAdmin';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('products');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await adminAPI.getUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Ошибка загрузки пользователей:', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'users') {
        const usersData = await adminAPI.getUsers();
        setUsers(usersData);
      } else if (activeTab === 'orders') {
        const ordersData = await adminAPI.getOrders();
        setOrders(ordersData);
      } else if (activeTab === 'stats') {
        const statsData = await adminAPI.getStats();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  const regularUsers = users.filter(u => u.role !== 'admin');
  const adminUsers = users.filter(u => u.role === 'admin');

  const regularOrders = orders.filter(order => {
    const user = users.find(u => u.id === order.userId);
    return !user || user.role !== 'admin';
  });

  const handleViewUserOrders = async (user) => {
    setSelectedUser(user);
    try {
      const userOrders = await adminAPI.getUserOrders(user.id);
      setSelectedUserOrders(userOrders);
    } catch (err) {
      console.error('Ошибка загрузки заказов пользователя:', err);
      setSelectedUserOrders([]);
    }
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setSelectedUserOrders([]);
  };

  if (selectedUser) {
    return (
      <div className="content-area">
        <button className="back-btn" onClick={handleBackToUsers}>
          ← Назад к пользователям
        </button>

        <div className="profile-header">
          <div className="profile-avatar-large">
            {selectedUser.email.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{selectedUser.email}</h1>
            <p className="profile-email-display">
              Роль: {selectedUser.role} • Зарегистрирован: {new Date(selectedUser.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h2>Заказы пользователя ({selectedUserOrders.length})</h2>
          
          {selectedUserOrders.length === 0 ? (
            <div className="empty-state">
              <p>У пользователя пока нет заказов</p>
            </div>
          ) : (
            <div className="orders-list">
              {selectedUserOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Заказ #{order.id}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="order-customer">
                    👤 {order.fullName} • 📞 {order.phone} • ✉️ {order.email}
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <img src={item.image} alt={item.name} />
                        <div className="order-item-info">
                          <span>{item.name}</span>
                          <span>× {item.quantity}</span>
                        </div>
                        <span className="order-item-price">
                          {(item.price * item.quantity).toFixed(0)} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    Итого: <strong>{order.total.toFixed(0)} ₽</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <h1>🛠️ Админ-панель</h1>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Товары
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Пользователи
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Заказы
        </button>
        <button 
          className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Статистика
        </button>
      </div>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <>
          {activeTab === 'products' && <ProductsAdmin />}

          {activeTab === 'users' && (
            <div className="admin-section">
              <h2>Обычные пользователи ({regularUsers.length})</h2>
              
              {regularUsers.length === 0 ? (
                <div className="empty-state">
                  <p>Пока нет зарегистрированных пользователей</p>
                </div>
              ) : (
                <div className="users-list">
                  {regularUsers.map(user => (
                    <div key={user.id} className="user-card">
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="user-email">{user.email}</div>
                          <div className="user-role">{user.role}</div>
                        </div>
                      </div>
                      <div className="user-actions">
                        <div className="user-date">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                        <button 
                          className="view-orders-btn"
                          onClick={() => handleViewUserOrders(user)}
                        >
                          📦 Заказы
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {adminUsers.length > 0 && (
                <>
                  <h3 style={{ marginTop: '32px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                    👨‍💼 Администраторы ({adminUsers.length})
                  </h3>
                  <div className="users-list">
                    {adminUsers.map(user => (
                      <div key={user.id} className="user-card admin-card">
                        <div className="user-info">
                          <div className="user-avatar admin-avatar">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="user-email">{user.email}</div>
                            <div className="user-role admin-role">{user.role}</div>
                          </div>
                        </div>
                        <div className="user-date">
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-section">
              <h2>Все заказы ({regularOrders.length})</h2>
              
              {regularOrders.length === 0 ? (
                <div className="empty-state">
                  <p>Пока нет заказов</p>
                </div>
              ) : (
                <div className="orders-list">
                  {regularOrders.map(order => {
                    const user = users.find(u => u.id === order.userId);
                    return (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <span className="order-id">Заказ #{order.id}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div className="order-customer">
                          👤 {order.fullName} • 📞 {order.phone} • ✉️ {order.email}
                        </div>
                        <div className="order-user-email">
                          Аккаунт: <strong>{user?.email || 'Неизвестно'}</strong>
                        </div>
                        <div className="order-items">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="order-item">
                              <img src={item.image} alt={item.name} />
                              <div className="order-item-info">
                                <span>{item.name}</span>
                                <span>× {item.quantity}</span>
                              </div>
                              <span className="order-item-price">
                                {(item.price * item.quantity).toFixed(0)} ₽
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="order-total">
                          Итого: <strong>{order.total.toFixed(0)} ₽</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="admin-section">
              <h2>Статистика (без учёта админов)</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalUsers || 0}</div>
                  <div className="stat-label">Пользователей</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalOrders || 0}</div>
                  <div className="stat-label">Заказов</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{(stats.totalRevenue || 0).toFixed(0)} ₽</div>
                  <div className="stat-label">Общий доход</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {stats.totalOrders > 0 
                      ? ((stats.totalRevenue || 0) / stats.totalOrders).toFixed(0) 
                      : 0} ₽
                  </div>
                  <div className="stat-label">Средний чек</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
