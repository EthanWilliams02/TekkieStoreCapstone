import axios from 'axios';

// Central Axios instance for Spring Boot REST API
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
