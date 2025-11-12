import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const features = [
    {
      icon: '🔒',
      title: 'Безопасность',
      description: 'Ваши файлы защищены современными методами шифрования и хранятся на защищенных серверах'
    },
    {
      icon: '☁️',
      title: 'Доступность',
      description: 'Доступ к вашим файлам с любого устройства в любое время через веб-интерфейс'
    },
    {
      icon: '🔄',
      title: 'Синхронизация',
      description: 'Автоматическая синхронизация файлов между всеми вашими устройствами'
    },
    {
      icon: '👥',
      title: 'Совместная работа',
      description: 'Делитесь файлами с коллегами и друзьями с помощью публичных ссылок'
    },
    {
      icon: '📊',
      title: 'Статистика',
      description: 'Подробная статистика по использованию хранилища и активности файлов'
    },
    {
      icon: '⚡',
      title: 'Высокая скорость',
      description: 'Быстрая загрузка и скачивание файлов благодаря оптимизированной инфраструктуре'
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>My Cloud - Ваше надежное облачное хранилище</h1>
          <p className="hero-subtitle">
            Безопасное хранение, удобный доступ и эффективное управление вашими файлами в одном месте
          </p>
          
          {!isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Начать использовать бесплатно
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Войти в аккаунт
              </Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/storage" className="btn btn-primary btn-large">
                Перейти в хранилище
              </Link>
              {user?.is_admin && (
                <Link to="/admin" className="btn btn-secondary btn-large">
                  Панель администратора
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Почему выбирают My Cloud?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Безопасность данных</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Доступность</div>
            </div>
            <div className="stat">
              <div className="stat-number">100MB</div>
              <div className="stat-label">Бесплатное место</div>
            </div>
            <div className="stat">
              <div className="stat-number">∞</div>
              <div className="stat-label">Количество файлов</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;