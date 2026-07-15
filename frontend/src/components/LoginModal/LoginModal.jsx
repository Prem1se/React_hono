import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Spinner from '../ui/Spinner/Spinner';
import Modal from '../ui/Modal/Modal';
import Button from '../ui/Button/Button';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate('/forgot-password');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRegister ? t('auth.registerTitle') : t('auth.loginTitle')}>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="form-error">{error}</div>}
        
        <div className="form-group">
          <label>{t('auth.email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.ru"
            required
          />
        </div>
        
        <div className="form-group">
          <label>{t('auth.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 6 символов"
            required
            minLength={6}
          />
        </div>
        
        {!isRegister && (
          <button 
            type="button" 
            className="forgot-password-link"
            onClick={handleForgotPassword}
          >
            {t('auth.forgotPassword')}
          </button>
        )}
        
        <Button type="submit" variant="primary" size="large" disabled={loading}>
          {loading ? (
            <div className="button-spinner">
              <Spinner size="small" />
            </div>
          ) : (isRegister ? t('auth.registerNow') : t('auth.loginNow'))}
        </Button>

        <div className="auth-switch">
          {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}
          <button 
            type="button" 
            className="switch-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? t('auth.loginNow') : t('auth.registerNow')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
