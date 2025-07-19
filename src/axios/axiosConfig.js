import axios from 'axios';

// Football API (standings, leagues, etc.)
const API_FOOTBALL_BASE_URL = 'https://koora-plus.onrender.com/api'

const footballApi = axios.create({
  baseURL: API_FOOTBALL_BASE_URL,
});

// Remove API key from frontend for security
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
const NEWS_API_BASE_URL = 'https://koora-plus.onrender.com/api/news'

const newsApi = axios.create({
  baseURL: NEWS_API_BASE_URL,
});

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

