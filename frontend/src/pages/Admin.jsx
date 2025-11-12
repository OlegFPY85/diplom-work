import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, updateUser, deleteUser, clearError } from '../../store/slices/usersSlice';
import UserList from '../../components/Admin/UserList';
import ErrorMessage from '../../components/Common/ErrorMessage';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Admin.css';

const Admin = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const { users, loading, error } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await dispatch(updateUser({ 
        userId, 
        data: { is_admin: !isAdmin } 
      })).unwrap();
    } catch (error) {
      console.error('Ошибка обновления пользователя:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя? Все его файлы также будут удалены.')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
      }
    }
  };

  const handleViewStorage = (userId) => {
    setSelectedUserId(userId);
    // Здесь можно добавить навигацию к хранилищу пользователя
    // или открыть модальное окно с файлами
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner message="Загрузка пользователей..." />;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Панель администратора</h1>
        <p>Управление пользователями и системами</p>
      </div>

      <ErrorMessage error={error} onRetry={() => dispatch(fetchUsers())} />

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Всего пользователей</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.filter(user => user.is_admin).length}
          </div>
          <div className="stat-label">Администраторов</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {users.reduce((total, user) => total + user.storage_stats.file_count, 0)}
          </div>
          <div className="stat-label">Всего файлов</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {Math.round(users.reduce((total, user) => total + user.storage_stats.total_size_mb, 0))} MB
          </div>
          <div className="stat-label">Общий объем</div>
        </div>
      </div>

      <UserList
        users={users}
        onToggleAdmin={handleToggleAdmin}
        onDeleteUser={handleDeleteUser}
        onViewStorage={handleViewStorage}
        loading={loading}
      />

      {selectedUserId && (
        <div className="user-storage-modal">
          {/* Здесь можно реализовать модальное окно для просмотра хранилища пользователя */}
        </div>
      )}
    </div>
  );
};

export default Admin;