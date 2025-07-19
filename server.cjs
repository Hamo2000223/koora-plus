const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Replace with your real API key
const API_KEY =process.env.VITE_API_FOOTBALL_KEY;

// Allow CORS for your frontend (adjust origin as needed)
app.use(cors({
  origin: 'http://localhost:5173', // or your deployed frontend URL
  credentials: true,
}));

// Parse JSON bodies (for POST/PUT requests)
app.use(bodyParser.json());

// Universal proxy for all /api/* endpoints
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

// Add NewsAPI endpoint
const NEWS_API_KEY = process.env.VITE_API_NEWS_KEY || process.env.NEWS_API_KEY;
app.get('/api/news', async (req, res) => {
  try {
    const { page = 1, pageSize = 8, q = 'كرة القدم', language = 'ar', sortBy = 'publishedAt' } = req.query;
    const url = `https://newsapi.org/v2/everything`;
    const response = await axios.get(url, {
      params: {
        q,
        language,
        sortBy,
        page,
        pageSize,
        apiKey: NEWS_API_KEY,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message || 'NewsAPI proxy error',
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});