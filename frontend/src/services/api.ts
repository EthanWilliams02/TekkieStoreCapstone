import axios from 'axios';

// Central Axios instance for Spring Boot REST API
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT bearer token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tekkie_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
