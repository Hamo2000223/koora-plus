import axios from 'axios';

const API_FOOTBALL_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;

const API_BASE_URL = import.meta.env.PROD
  ? 'https://koora-plus-backend.vercel.app/api'
  : '/api';

const footballApi = axios.create({
  baseURL: API_BASE_URL,
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
  (error) => Promise.reject(error)
);

const newsApi = axios.create({
  baseURL: API_BASE_URL,
});

newsApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { footballApi, newsApi };

