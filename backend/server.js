require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

/* =========================
   IMPORT ROUTES & CRON
========================= */
const authRoutes = require("./routes/authRoutes");

/* =========================
   APP SETUP
========================= */
const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   ENV VARIABLES
========================= */
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error("❌ OPENWEATHER_API_KEY missing in .env");
}

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env");
}

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing in .env");
}

const BASE_URL = "https://api.openweathermap.org/data/2.5";

/* =========================
   MONGODB CONNECTION
========================= */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(
      "❌ MongoDB Connection Error:",
      error.message
    );

    process.exit(1);
  }
};

connectDB();

/* =========================
   GROQ SETUP
========================= */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Stormy Weather API is running ☁️");
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    weatherApi: !!API_KEY,
    groqApi: !!process.env.GROQ_API_KEY,
    mongoDb: mongoose.connection.readyState === 1,
  });
});

/* =========================
   CURRENT WEATHER
========================= */
app.get("/api/weather/current", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: "City is required",
      });
    }

    const response = await axios.get(
      `${BASE_URL}/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "Current Weather Error:",
      err.message
    );

    res.status(err.response?.status || 500).json({
      error:
        err.response?.data?.message ||
        "Failed to fetch current weather",
    });
  }
});

/* =========================
   WEATHER FORECAST
========================= */
app.get("/api/weather/forecast", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        error: "City is required",
      });
    }

    const response = await axios.get(
      `${BASE_URL}/forecast`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
          cnt: 40,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "Forecast Error:",
      err.message
    );

    res.status(err.response?.status || 500).json({
      error:
        err.response?.data?.message ||
        "Failed to fetch forecast",
    });
  }
});

/* =========================
   STORMY AI CHATBOT
========================= */
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages array is required",
      });
    }

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content: `
You are Stormy, a smart and friendly AI weather assistant for WeatherCast.

Your responsibilities:
- Explain weather forecasts clearly
- Give travel suggestions
- Recommend clothing based on weather
- Warn users about rain, heatwaves, storms, fog, and UV
- Help users plan their day
- Keep responses concise, modern, and friendly

Tone:
- Professional
- Conversational
- Helpful
- Positive
            `,
          },

          ...messages,
        ],

        temperature: 0.7,
        max_tokens: 1024,
      });

    res.json({
      reply:
        completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Groq Error:", err);

    res.status(500).json({
      error:
        "Stormy AI is unavailable right now",
      details: err.message,
    });
  }
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
  });
});

/* =========================
   CRON JOBS
========================= */
require("./cron/dailyForecastCron");
require("./cron/weatherAlertCron");

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(
    `✅ Server running on port ${PORT}`
  );

  console.log(
    `🌦️ Weather API Loaded: ${!!API_KEY}`
  );

  console.log(
    `🤖 Groq API Loaded: ${!!process.env.GROQ_API_KEY}`
  );

  console.log(
    `📧 Email Service Loaded: ${!!process.env.EMAIL_USER}`
  );
});

// require('dotenv').config();

// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const Groq = require('groq-sdk');

// const app = express();
// const PORT = process.env.PORT || 5000;

// /* =========================
//    MIDDLEWARE
// ========================= */
// app.use(cors());
// app.use(express.json());

// /* =========================
//    ENV VARIABLES
// ========================= */
// const API_KEY = process.env.OPENWEATHER_API_KEY;

// if (!API_KEY) {
//   console.error('❌ OPENWEATHER_API_KEY missing in .env');
// }

// if (!process.env.GROQ_API_KEY) {
//   console.error('❌ GROQ_API_KEY missing in .env');
// }

// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// /* =========================
//    GROQ SETUP
// ========================= */
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// /* =========================
//    HOME ROUTE
// ========================= */
// app.get('/', (req, res) => {
//   res.send('Stormy Weather API is running ☁️');
// });

// /* =========================
//    HEALTH CHECK
// ========================= */
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     weatherApi: !!API_KEY,
//     groqApi: !!process.env.GROQ_API_KEY,
//   });
// });

// /* =========================
//    CURRENT WEATHER
// ========================= */
// app.get('/api/weather/current', async (req, res) => {
//   try {
//     const { city } = req.query;

//     if (!city) {
//       return res.status(400).json({
//         error: 'City is required',
//       });
//     }

//     const response = await axios.get(`${BASE_URL}/weather`, {
//       params: {
//         q: city,
//         appid: API_KEY,
//         units: 'metric',
//       },
//     });

//     res.json(response.data);
//   } catch (err) {
//     console.error('Weather Error:', err.message);

//     res.status(err.response?.status || 500).json({
//       error:
//         err.response?.data?.message ||
//         'Failed to fetch current weather',
//     });
//   }
// });

// /* =========================
//    WEATHER FORECAST
// ========================= */
// app.get('/api/weather/forecast', async (req, res) => {
//   try {
//     const { city } = req.query;

//     if (!city) {
//       return res.status(400).json({
//         error: 'City is required',
//       });
//     }

//     const response = await axios.get(`${BASE_URL}/forecast`, {
//       params: {
//         q: city,
//         appid: API_KEY,
//         units: 'metric',
//         cnt: 40,
//       },
//     });

//     res.json(response.data);
//   } catch (err) {
//     console.error('Forecast Error:', err.message);

//     res.status(err.response?.status || 500).json({
//       error:
//         err.response?.data?.message ||
//         'Failed to fetch forecast',
//     });
//   }
// });

// /* =========================
//    STORMY AI CHATBOT
// ========================= */
// app.post('/api/chat', async (req, res) => {
//   try {
//     const { messages } = req.body;

//     if (!messages || !Array.isArray(messages)) {
//       return res.status(400).json({
//         error: 'Messages array is required',
//       });
//     }

//     const completion = await groq.chat.completions.create({
//       model: 'llama-3.3-70b-versatile',

//       messages: [
//         {
//           role: 'system',
//           content: `
// You are Stormy, a friendly weather assistant for WeatherCast.

// You help users with:
// - weather forecasts
// - travel suggestions
// - clothing advice
// - weather explanations
// - friendly conversations

// Keep answers concise, practical, and friendly.
//           `,
//         },

//         ...messages,
//       ],

//       temperature: 0.7,
//       max_tokens: 1024,
//     });

//     res.json({
//       reply: completion.choices[0].message.content,
//     });
//   } catch (err) {
//     console.error('Groq Error:', err);

//     res.status(500).json({
//       error: 'Stormy AI is unavailable right now',
//       details: err.message,
//     });
//   }
// });

// /* =========================
//    GLOBAL ERROR HANDLER
// ========================= */
// app.use((err, req, res, next) => {
//   console.error('Server Error:', err);

//   res.status(500).json({
//     error: 'Internal Server Error',
//   });
// });

// /* =========================
//    START SERVER
// ========================= */
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
//   console.log(`🌦️ Weather API Loaded: ${!!API_KEY}`);
//   console.log(`🤖 Groq API Loaded: ${!!process.env.GROQ_API_KEY}`);
// });