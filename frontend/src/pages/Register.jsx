import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import { 
  validateLogin, 
  validatePassword, 
  validateEmail, 
  validateFullName 
} from '../../utils/validators';
import ErrorMessage from '../../components/Common/ErrorMessage';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    password_confirm: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/storage', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return validateLogin(value);
      case 'email':
        return validateEmail(value);
      case 'full_name':
        return validateFullName(value);
      case 'password':
        return validatePassword(value);
      case 'password_confirm':
        return value === formData.password ? '' : 'Пароли не совпадают';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Валидация в реальном времени
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Финальная валидация всех полей
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await dispatch(register(formData)).unwrap();
    } catch (error) {
      // Ошибка обрабатывается в slice
    }
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim()) && 
           Object.values(fieldErrors).every(error => !error);
  };

  if (loading) {
    return <LoadingSpinner message="Регистрация..." />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Регистрация</h1>
          <p className="auth-subtitle">Создайте новый аккаунт для доступа к облачному хранилищу</p>

          <ErrorMessage error={error} />

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Логин *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder="Только латинские буквы и цифры"
                className={fieldErrors.username ? 'error' : ''}
              />
              {fieldErrors.username && (
                <span className="field-error">{fieldErrors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="example@mail.com"
                className={fieldErrors.email ? 'error' : ''}
              />
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="full_name">Полное имя *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Иван Иванов"
                className={fieldErrors.full_name ? 'error' : ''}
              />
              {fieldErrors.full_name && (
                <span className="field-error">{fieldErrors.full_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Минимум 6 символов"
                className={fieldErrors.password ? 'error' : ''}
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password_confirm">Подтверждение пароля *</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="Повторите пароль"
                className={fieldErrors.password_confirm ? 'error' : ''}
              />
              {fieldErrors.password_confirm && (
                <span className="field-error">{fieldErrors.password_confirm}</span>
              )}
            </div>

            <div className="password-requirements">
              <p>Пароль должен содержать:</p>
              <ul>
                <li className={formData.password.length >= 6 ? 'valid' : ''}>
                  Минимум 6 символов
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                  Хотя бы одну заглавную букву
                </li>
                <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                  Хотя бы одну цифру
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'valid' : ''}>
                  Хотя бы один специальный символ
                </li>
              </ul>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading || !isFormValid()}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Уже есть аккаунт?{' '}
              <Link to="/login" className="auth-link">
                Войти
              </Link>
            </p>
            <p>
              <Link to="/" className="auth-link">
                ← Вернуться на главную
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;