import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugCode, setDebugCode] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authAPI.forgotPassword(email);
      setDebugCode(data.debug_code || '');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    try {
      await authAPI.resetPassword(email, code, newPassword);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Ошибка сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← На главную
      </button>

      <div className="forgot-password-container">
        <h1>Восстановление пароля</h1>

        {error && <div className="error-message">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="forgot-form">
            <p className="forgot-description">
              Введите email вашего аккаунта. Мы отправим на него код подтверждения.
            </p>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@mail.ru"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Отправка...' : 'Получить код'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="forgot-form">
            <p className="forgot-description">
              Введите код из письма и новый пароль.
            </p>

            {debugCode && (
              <div className="debug-code">
                🔑 Код для тестов: <strong>{debugCode}</strong>
              </div>
            )}

            <div className="form-group">
              <label>Код подтверждения</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="123456"
                maxLength="6"
                pattern="[0-9]{6}"
              />
            </div>

            <div className="form-group">
              <label>Новый пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Подтвердите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сменить пароль'}
            </button>

            <button 
              type="button" 
              className="btn-back"
              onClick={() => setStep(1)}
            >
              Изменить email
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Пароль изменён</h2>
            <p>Теперь вы можете войти с новым паролем</p>
            <button className="btn-submit" onClick={() => navigate('/login')}>
              Войти
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
