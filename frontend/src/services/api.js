import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login/', { username, password }),
  
  register: (userData) => 
    api.post('/auth/register/', userData),
  
  logout: () => 
    api.post('/auth/logout/'),
  
  getMe: () => 
    api.get('/auth/users/me/'),
};

export const storageAPI = {
  getFiles: (userId = null) => {
    const params = userId ? { user_id: userId } : {};
    return api.get('/storage/files/', { params });
  },
  
  uploadFile: (formData, onUploadProgress) => 
    api.post('/storage/files/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onUploadProgress(progress);
        }
      },
    }),
  
  deleteFile: (fileId) => 
    api.delete(`/storage/files/${fileId}/`),
  
  updateFile: (fileId, data) => 
    api.patch(`/storage/files/${fileId}/`, data),
  
  downloadFile: (fileId) => 
    api.get(`/storage/files/${fileId}/download/`, {
      responseType: 'blob',
    }),
  
  getPublicLink: (fileId) => 
    api.post(`/storage/files/${fileId}/make_public/`),
  
  makePrivate: (fileId) => 
    api.post(`/storage/files/${fileId}/make_private/`),
};

export const usersAPI = {
  getUsers: () => 
    api.get('/users/'),
  
  updateUser: (userId, data) => 
    api.patch(`/users/${userId}/`, data),
  
  deleteUser: (userId) => 
    api.delete(`/users/${userId}/`),
};

export default api;