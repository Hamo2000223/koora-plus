const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

const API_KEY = process.env.VITE_API_FOOTBALL_KEY;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(NEWS_API_KEY);

app.use(cors({
  origin: ['http://localhost:5173', 'https://koora-plus.vercel.app','https://koora-plus.onrender.com'],
  credentials: true,
}));

app.use(bodyParser.json());

// ✅ News API Proxy using official library
app.get('/api/news', async (req, res) => {
  try {
    const { q = 'كرة القدم', language = 'ar', sortBy = 'publishedAt', page = 1, pageSize = 8 } = req.query;

    const response = await newsapi.v2.everything({
      q,
      language,
      sortBy,
      page,
      pageSize
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('NewsAPI error:', error);
    res.status(500).json({ error: error.message || 'NewsAPI error' });
  }
});

// Test NewsAPI.org using the official library
app.get('/api/news/test', async (req, res) => {
  try {
    const response = await newsapi.v2.everything({
      q: 'كرة القدم',
      language: 'ar',
      sortBy: 'publishedAt',
      page: 1,
      pageSize: 8
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('NewsAPI (library) error:', error);
    res.status(500).json({ error: error.message || 'NewsAPI library error' });
  }
});

// ✅ Football API Proxy
app.use('/api', async (req, res) => {
  try {
    const apiUrl = `https://v3.football.api-sports.io${req.originalUrl.replace(/^\/api/, '')}`;
    const response = await axios({
      method: req.method,
      url: apiUrl,
      params: req.query,
      data: req.body,
      headers: {
        'x-apisports-key': API_KEY,
        ...req.headers,
        host: undefined,
        origin: undefined,
        referer: undefined,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'Proxy error',
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
