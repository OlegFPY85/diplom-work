import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">☁️</span>
            My Cloud
          </Link>
          
          <nav className="nav">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/storage" 
                  className={`nav-link ${isActive('/storage')}`}
                >
                  Моё хранилище
                </Link>
                
                {user?.is_admin && (
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActive('/admin')}`}
                  >
                    Администрирование
                  </Link>
                )}
                
                <div className="user-info">
                  <span className="user-name">
                    {user?.full_name} ({user?.username})
                  </span>
                  {user?.is_admin && (
                    <span className="admin-badge">Админ</span>
                  )}
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                  title="Выйти из системы"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`nav-link ${isActive('/login')}`}
                >
                  Вход
                </Link>
                <Link 
                  to="/register" 
                  className={`nav-link ${isActive('/register')}`}
                >
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;