import axios from 'axios';
import { storage } from './storage'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-new-token'];
    
    if (newToken) {
      console.log('🔄 Token renovado automaticamente');
      storage.setToken(newToken);
    }
    
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout: Servidor demorou muito para responder');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Erro de rede: Verifique CORS no backend');
    } else if (!error.response) {
      console.error('Sem resposta do servidor:', error.message);
    }
    
    if (error.response && error.response.status === 401) {
      storage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;