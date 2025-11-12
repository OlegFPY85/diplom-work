import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ error, onRetry = null }) => {
  if (!error) return null;

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.detail) return error.detail;
    
    // Обработка ошибок валидации Django
    if (typeof error === 'object') {
      const firstKey = Object.keys(error)[0];
      const firstError = error[firstKey];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      return firstError;
    }
    
    return 'Произошла неизвестная ошибка';
  };

  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <p>{getErrorMessage(error)}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-btn">
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;