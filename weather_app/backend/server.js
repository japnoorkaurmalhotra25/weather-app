const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* =========================
   HOME ROUTE
========================= */
app.get('/', (req, res) => {
  res.send('Stormy Weather API is running ☁️');
});

/* =========================
   CURRENT WEATHER
========================= */
app.get('/api/weather/current', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error:
        err.response?.data?.message ||
        'Failed to fetch weather',
    });
  }
});

/* =========================
   WEATHER FORECAST
========================= */
app.get('/api/weather/forecast', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        cnt: 40,
      },
    });

    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error:
        err.response?.data?.message ||
        'Failed to fetch forecast',
    });
  }
});

/* =========================
   STORMY AI CHATBOT
========================= */
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Empty message' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `
You are Stormy, a friendly and helpful AI assistant 
for a weather app called WeatherCast.

You help users with:
- weather-related questions
- clothing suggestions
- travel advice
- weather explanations
- general conversation

Be friendly, concise, and practical.
          `,
        },
        ...messages,
      ],
      max_tokens: 1024,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error('Groq error:', err);

    res.status(500).json({
      error: 'Stormy is unavailable right now',
    });
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
