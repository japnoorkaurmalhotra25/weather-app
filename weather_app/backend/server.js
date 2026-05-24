const express = require('express');
const cors = require('cors');
const axios = require('axios');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// GET current weather by city
app.get('/api/weather/current', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units: 'metric' },
    });
    res.json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.response?.data?.message || 'Failed to fetch weather' });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Weather API running' }));

app.listen(PORT, () => console.log(`Server running on http://localhost:3000`));