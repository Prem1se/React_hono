import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Spinner from '../ui/Spinner/Spinner';
import Button from '../ui/Button/Button';
import EmptyState from '../ui/EmptyState/EmptyState';
import './PasswordChange.css';

const PasswordChange = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await user.updatePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password change error:', err);
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="content-area container">
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
    <div className="content-area container">
      <div className="password-change">
        <div className="password-change-container">
          <h2>{t('profile.changePassword')}</h2>
          
          {success && (
            <div className="success-message">
              <p>{t('auth.passwordChanged')}</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('auth.currentPassword')}</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('auth.newPassword')}</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="form-group">
              <label>{t('auth.confirmPassword')}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="button-spinner">
                  <Spinner size="small" />
                </div>
              ) : (
                t('profile.changePassword')
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
