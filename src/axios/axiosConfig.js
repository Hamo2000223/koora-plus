import axios from 'axios';

const API_FOOTBALL_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
// Use full URL in production, relative path in development
const API_FOOTBALL_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'https://your-backend-url.com') 
  : '/api';

const footballApi = axios.create({
  baseURL: API_FOOTBALL_BASE_URL,
});

footballApi.interceptors.request.use(
  (config) => {
    config.headers['x-apisports-key'] = API_FOOTBALL_KEY;
    return config;
  },
  (error) => Promise.reject(error)
);

footballApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally handle unauthorized errors here
    }
    return Promise.reject(error);
  }
);

export default footballApi;
