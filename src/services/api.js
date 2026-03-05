import axios from 'axios';
import { storage } from './storage';
import logger from '../utils/logger'; 

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
  
  // Log da requisição
  logger.apiRequest(config.method.toUpperCase(), config.url, config.data);
  
  return config;
}, (error) => {
  logger.error('Erro no interceptor de request', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-new-token'];
    
    if (newToken) {
      logger.info('Token renovado automaticamente');
      storage.setToken(newToken);
    }
    
    // Log da resposta
    logger.apiResponse(
      response.config.method.toUpperCase(),
      response.config.url,
      response.status,
      response.data
    );
    
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      logger.error('Timeout: Servidor demorou muito para responder', { timeout: error.config.timeout });
    } else if (error.code === 'ERR_NETWORK') {
      logger.error('Erro de rede: Verifique CORS no backend', { url: error.config?.url });
    } else if (!error.response) {
      logger.error('Sem resposta do servidor', { message: error.message });
    } else {
      // Log de erro da API
      logger.apiResponse(
        error.config?.method?.toUpperCase() || 'UNKNOWN',
        error.config?.url || 'UNKNOWN',
        error.response?.status || 0,
        error.response?.data
      );
    }
    
    if (error.response && error.response.status === 401) {
      logger.warn('Usuário não autenticado - redirecionando para login');
      storage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;