import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchFiles, 
  uploadFile, 
  deleteFile, 
  updateFile, 
  downloadFile,
  getPublicLink,
  setUploadProgress,
  clearUploadProgress,
  clearError 
} from '../../store/slices/storageSlice';
import FileList from '../../components/Storage/FileList';
import FileUpload from '../../components/Storage/FileUpload';
import StorageStats from '../../components/Storage/StorageStats';
import ErrorMessage from '../../components/Common/ErrorMessage';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './Storage.css';

const Storage = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const { files, loading, error, uploadProgress } = useSelector(state => state.storage);
  const { user } = useSelector(state => state.auth);
  const { users } = useSelector(state => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
    if (user?.is_admin && selectedUser) {
      dispatch(fetchFiles(selectedUser));
    } else {
      dispatch(fetchFiles());
    }
  }, [dispatch, user, selectedUser]);

  const handleUpload = async (formData) => {
    try {
      await dispatch(uploadFile(formData)).unwrap();
      setShowUpload(false);
      dispatch(clearUploadProgress());
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      try {
        await dispatch(deleteFile(fileId)).unwrap();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleRename = async (fileId, newName) => {
    try {
      await dispatch(updateFile({ fileId, data: { original_name: newName } })).unwrap();
    } catch (error) {
      console.error('Ошибка переименования:', error);
      throw error;
    }
  };

  const handleUpdateComment = async (fileId, comment) => {
    try {
      await dispatch(updateFile({ fileId, data: { comment } })).unwrap();
    } catch (error) {
      console.error('Ошибка обновления комментария:', error);
      throw error;
    }
  };

  const handleDownload = async (fileId) => {
    try {
      await dispatch(downloadFile(fileId)).unwrap();
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    }
  };

  const handleGetPublicLink = async (fileId) => {
    try {
      const result = await dispatch(getPublicLink(fileId)).unwrap();
      return result.publicUrl;
    } catch (error) {
      console.error('Ошибка получения ссылки:', error);
      throw error;
    }
  };

  const handleUserChange = (userId) => {
    setSelectedUser(userId);
  };

  if (loading && files.length === 0) {
    return <LoadingSpinner message="Загрузка файлов..." />;
  }

  return (
    <div className="storage-page">
      <div className="storage-header">
        <div className="storage-title">
          <h1>
            {user?.is_admin && selectedUser ? 'Управление файлами пользователя' : 'Мое хранилище'}
          </h1>
          <p>Управляйте вашими файлами в облачном хранилище</p>
        </div>
        
        <div className="storage-actions">
          <button 
            onClick={() => setShowUpload(true)}
            className="btn btn-primary"
          >
            📁 Загрузить файл
          </button>
        </div>
      </div>

      {user?.is_admin && (
        <div className="user-selector">
          <label htmlFor="user-select">Пользователь:</label>
          <select 
            id="user-select"
            value={selectedUser || ''} 
            onChange={(e) => handleUserChange(e.target.value || null)}
            className="user-select"
          >
            <option value="">Все пользователи</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.full_name} ({user.username})
              </option>
            ))}
          </select>
        </div>
      )}

      <ErrorMessage error={error} onRetry={() => dispatch(fetchFiles(selectedUser))} />

      <StorageStats files={files} />

      <FileList
        files={files}
        onDelete={handleDelete}
        onRename={handleRename}
        onUpdateComment={handleUpdateComment}
        onDownload={handleDownload}
        onGetPublicLink={handleGetPublicLink}
        loading={loading}
      />

      {showUpload && (
        <FileUpload
          onUpload={handleUpload}
          onCancel={() => {
            setShowUpload(false);
            dispatch(clearUploadProgress());
          }}
          progress={uploadProgress}
        />
      )}
    </div>
  );
};

export default Storage;