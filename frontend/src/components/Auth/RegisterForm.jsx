import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  validateLogin, 
  validatePassword, 
  validateEmail, 
  validateFullName 
} from '../../utils/validators';
import './AuthForms.css';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!validateLogin(value)) {
          return 'Логин должен содержать только латинские буквы и цифры, начинаться с буквы и быть от 4 до 20 символов';
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          return 'Введите корректный email адрес';
        }
        break;
      case 'full_name':
        if (!validateFullName(value)) {
          return 'Полное имя должно содержать минимум 2 символа';
        }
        break;
      case 'password':
        if (!validatePassword(value)) {
          return 'Пароль должен содержать минимум 6 символов, включая заглавную букву, цифру и специальный символ';
        }
        break;
      case 'password_confirm':
        if (value !== formData.password) {
          return 'Пароли не совпадают';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Валидация в реальном времени
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Финальная валидация всех полей
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const result = await register(formData);
    if (!result.success) {
      setErrors({ submit: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="auth-form-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Логин:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Полное имя:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          {errors.full_name && <span className="error">{errors.full_name}</span>}
        </div>

        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Подтверждение пароля:</label>
          <input
            type="password"
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            required
          />
          {errors.password_confirm && (
            <span className="error">{errors.password_confirm}</span>
          )}
        </div>

        {errors.submit && (
          <div className="error submit-error">{errors.submit}</div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="switch-form">
          Уже есть аккаунт?{' '}
          <button type="button" onClick={onSwitchToLogin} className="link-button">
            Войти
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;