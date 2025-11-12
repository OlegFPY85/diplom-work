import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-icon">🔍</div>
        <h1>Страница не найдена</h1>
        <p>Извините, запрашиваемая страница не существует или была перемещена.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Вернуться на главную
          </Link>
          <Link to="/storage" className="btn btn-secondary">
            Перейти в хранилище
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;