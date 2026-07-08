import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ordersAPI } from '../../services/api';
import EmptyState from '../ui/EmptyState/EmptyState';
import PurchaseItem from '../PurchaseItem/PurchaseItem';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userOrders = await ordersAPI.getAll();
        setOrders(userOrders);
      } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="content-area">
        <EmptyState 
          title={t('profile.notAuthorized')}
          description={t('profile.loginRequired')}
          actionText={t('cart.continueShopping')}
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{t('profile.title')}</h1>
            <p className="profile-email-display">{user.email}</p>
          </div>
        </div>

        <div className="profile-section">
          <h2>{t('profile.purchaseHistory')}</h2>
          
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : orders.length === 0 ? (
            <EmptyState 
              title={t('profile.noPurchases')}
              actionText={t('profile.goToProducts')}
              onAction={() => navigate('/')}
            />
          ) : (
            <div className="purchase-list">
              {orders.map(order => (
                <PurchaseItem key={order.id} purchase={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
