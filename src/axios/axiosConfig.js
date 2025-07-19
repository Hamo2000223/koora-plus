import axios from 'axios';

const API_FOOTBALL_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
// Football API (standings, leagues, etc.)
const API_FOOTBALL_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'https://koora-plus-backend.vercel.app/api')
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

// News API (news only)
const NEWS_API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_NEWS_URL || 'https://koora-plus-backend.vercel.app/api/news')
  : '/api/news';

const newsApi = axios.create({
  baseURL: NEWS_API_BASE_URL,
});
newsApi.interceptors.request.use(
  (config) => {
    config.params = {
      ...(config.params || {}),
      apiKey: import.meta.env.VITE_API_NEWS_KEY, // your static param here
    };
    return config;
  },
  (error) => Promise.reject(error)
);
newsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally handle unauthorized errors here
    }
    return Promise.reject(error);
  }
);

export { footballApi, newsApi };

