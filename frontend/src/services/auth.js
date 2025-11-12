import api from './api';

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  
  logout: async () => {
    // На бэкенде можно добавить endpoint для blacklist токена
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  getMe: async () => {
    const response = await api.get('/auth/users/me/');
    return response.data;
  }
};