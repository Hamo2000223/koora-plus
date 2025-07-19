const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

// Replace with your real API key
const API_KEY = process.env.VITE_API_FOOTBALL_KEY;

// Allow CORS for your frontend (adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:5173', // or your deployed frontend URL
  credentials: true,
}));

// Parse JSON bodies (for POST/PUT requests)
app.use(bodyParser.json());

const NEWS_API_KEY = process.env.NEWS_API_KEY;
// Place this BEFORE the universal /api proxy!
app.get('/api/news', async (req, res) => {
  try {
    const { q = 'كرة القدم', lang = 'ar', sortby = 'publishedAt', country = 'eg', page = 1, max = 8 } = req.query;

    const url = `https://gnews.io/api/v4/search`;
    const response = await axios.get(url, {
      params: {
        q,
        lang,
        sortby,
        country,
        page,
        max,
        apikey: NEWS_API_KEY,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    // Log error for debugging
    console.error('NewsAPI error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'NewsAPI proxy error',
    });
  }
});

// Universal proxy for all /api/* endpoints (keep this after /api/news)
app.use('/api', async (req, res) => {
  try {
    // Build the target URL
    const apiUrl = `https://v3.football.api-sports.io${req.originalUrl.replace(/^\/api/, '')}`;
    // Forward the request (method, params, body, headers)
    const response = await axios({
      method: req.method,
      url: apiUrl,
      params: req.query,
      data: req.body,
      headers: {
        'x-apisports-key': API_KEY,
        // Forward content-type and others if needed
        ...req.headers,
        host: undefined, // Remove host header to avoid issues
        origin: undefined, // Remove origin header to avoid CORS issues
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