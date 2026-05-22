import axios from 'axios';
import { API_URL } from '../constants/Config';
import { getToken } from './tokenService';
import { globalErrorHandler } from '../context/ErrorContext';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Neural connection lost. Please try again.';
    const status = error.response?.status;
    
    console.error('[API Error]', message, status);
    
      if (status === 401) {
        // Handle unauthorized (maybe redirect to login or clear token)
        // Temporarily commented out for debugging 401 persistence
        // const { removeToken } = require('./tokenService');
        // removeToken().catch(console.error);
        globalErrorHandler('Unauthorized', 'Your session has expired. Please log in again.');
      } else if (status === 403) {
        globalErrorHandler('Forbidden', message);
    } else if (status >= 500) {
      globalErrorHandler('Server Error', 'The neural processor is currently offline. Please wait.');
    } else {
      globalErrorHandler('Connection Error', message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
