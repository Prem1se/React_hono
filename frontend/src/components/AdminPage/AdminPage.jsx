import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Spinner from '../ui/Spinner/Spinner';
import { useLanguage } from '../../context/LanguageContext';
import ProductsAdmin from './ProductsAdmin';
import { ProductIcon, UsersIcon, OrderIcon, StatsIcon, ViewOrdersIcon, AdminBadgeIcon, UserIcon, PhoneIcon, EmailIcon } from '../ui/Icons';
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
        console.error('Error loading users:', err);
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
      console.error('Error loading data:', err);
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
      <div className="content-area container">
        <button className="back-btn" onClick={handleBackToUsers}>
          ← {t('admin.users')}
        </button>

        <div className="profile-header">
          <div className="profile-avatar-large">
            {selectedUser.email.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{selectedUser.email}</h1>
            <p className="profile-email-display">
              {t('admin.role')}: {selectedUser.role} • {t('admin.userRegistered')}: {new Date(selectedUser.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h2>{t('admin.ordersList')} ({selectedUserOrders.length})</h2>
          
          {selectedUserOrders.length === 0 ? (
            <div className="empty-state">
              <p>{t('admin.noOrders')}</p>
            </div>
          ) : (
            <div className="orders-list">
              {selectedUserOrders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">{t('admin.orderNumber')} {order.id}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="order-customer">
                    <UserIcon size={14} /> {order.fullName} • <PhoneIcon size={14} /> {order.phone} • <EmailIcon size={14} /> {order.email}
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
                    {t('admin.total')}: <strong>{order.total.toFixed(0)} ₽</strong>
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
    <div className="content-area container">
      <h1>{t('admin.panel')}</h1>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <ProductIcon size={16} /> {t('admin.products')}
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <UsersIcon size={16} /> {t('admin.users')}
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <OrderIcon size={16} /> {t('admin.orders')}
        </button>
        <button 
          className={`admin-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <StatsIcon size={16} /> {t('admin.stats')}
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <Spinner />
        </div>
      ) : (
        <>
          {activeTab === 'products' && <ProductsAdmin />}

          {activeTab === 'users' && (
            <div className="admin-section">
              <h2>{t('admin.regularUsers')} ({regularUsers.length})</h2>
              
              {regularUsers.length === 0 ? (
                <div className="empty-state">
                  <p>{t('admin.noRegisteredUsers')}</p>
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
                            <ViewOrdersIcon size={14} /> {t('admin.viewOrders')}
                          </button>
                        </div>
                    </div>
                  ))}
                </div>
              )}

              {adminUsers.length > 0 && (
                <>
                  <h3 style={{ marginTop: '32px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                    <AdminBadgeIcon size={16} /> {t('admin.administrators')} ({adminUsers.length})
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
              <h2>{t('admin.orders')} ({regularOrders.length})</h2>
              
              {regularOrders.length === 0 ? (
                <div className="empty-state">
                  <p>{t('admin.noOrdersYet')}</p>
                </div>
              ) : (
                <div className="orders-list">
                  {regularOrders.map(order => {
                    const user = users.find(u => u.id === order.userId);
                    return (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <span className="order-id">{t('admin.orderNumber')} {order.id}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div className="order-customer">
                          <UserIcon size={14} /> {order.fullName} • <PhoneIcon size={14} /> {order.phone} • <EmailIcon size={14} /> {order.email}
                        </div>
                        <div className="order-user-email">
                          {t('admin.account')}: <strong>{user?.email || t('admin.unknown')}</strong>
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
                          {t('admin.total')}: <strong>{order.total.toFixed(0)} ₽</strong>
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
              <h2>{t('admin.stats')}</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalUsers || 0}</div>
                  <div className="stat-label">{t('admin.totalUsers')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalOrders || 0}</div>
                  <div className="stat-label">{t('admin.totalOrders')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{(stats.totalRevenue || 0).toFixed(0)} ₽</div>
                  <div className="stat-label">{t('admin.totalRevenue')}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {stats.totalOrders > 0 
                      ? ((stats.totalRevenue || 0) / stats.totalOrders).toFixed(0) 
                      : 0} ₽
                  </div>
                  <div className="stat-label">{t('admin.averageCheck')}</div>
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
