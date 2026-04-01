import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { getCurrentWeather, getForecast } from '../services/weatherService';

const getEmoji = (main) => {
  const map = { Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Haze: '🌫️' };
  return map[main] || '🌡️';
};

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast(null);
    try {
      const [current, forecastData] = await Promise.all([
        getCurrentWeather(city),
        getForecast(city),
      ]);
      setWeather(current);
      setForecast(forecastData);
    } catch (err) {
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get one entry per day for 7-day forecast
  const dailyForecast = forecast
    ? Object.values(
        forecast.list.reduce((acc, item) => {
          const day = item.dt_txt.split(' ')[0];
          if (!acc[day]) acc[day] = item;
          return acc;
        }, {})
      ).slice(0, 7)
    : [];

  const now = weather
    ? new Date().toLocaleString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="home">
      <div className="overlay">

        {/* TOP BAR */}
        <div className="top-bar">
          <div className="logo">🌤 WeatherCast</div>
          <SearchBar onSearch={handleSearch} loading={loading} />
          <div className="top-icons">♡ ♥</div>
        </div>

        {/* ERROR */}
        {error && <div className="error-box">⚠️ {error}</div>}

        {/* PLACEHOLDER */}
        {!weather && !loading && !error && (
          <div className="placeholder">
            <p className="placeholder-icon">🌍</p>
            <p>Search for a city to see the weather</p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="placeholder">
            <div className="spinner"></div>
            <p>Fetching weather...</p>
          </div>
        )}

        {weather && (
          <>
            {/* HERO */}
            <div className="hero">
              <h1 className="temp">{Math.round(weather.main.temp)}°</h1>
              <span className="hero-emoji">{getEmoji(weather.weather[0].main)}</span>
              <h2 className="city">{weather.name}</h2>
              <p className="desc">
                {weather.weather[0].description} &nbsp;|&nbsp; {now}
              </p>
            </div>

            {/* STATS GLASS CARD */}
            <div className="stats-card">
              <div className="stat-item">☁️ <span>Feels Like</span> <strong>{Math.round(weather.main.feels_like)}°</strong></div>
              <div className="stat-item">💧 <span>Humidity</span> <strong>{weather.main.humidity}%</strong></div>
              <div className="stat-item">🌬️ <span>Wind</span> <strong>{weather.wind.speed} km/h</strong></div>
              <div className="stat-item">🔄 <span>Pressure</span> <strong>{weather.main.pressure} hPa</strong></div>
              <div className="stat-item">👁️ <span>Visibility</span> <strong>{((weather.visibility || 0) / 1000).toFixed(0)} km</strong></div>
            </div>

            {/* HOURLY FORECAST */}
            {forecast && (
              <div className="section">
                <div className="section-title">Hourly Forecast &gt;</div>
                <div className="hourly">
                  {forecast.list.slice(0, 6).map((item, i) => (
                    <div key={i} className={`hour-box ${i === 0 ? 'active' : ''}`}>
                      <p>{i === 0 ? 'Now' : new Date(item.dt_txt).getHours() + ':00'}</p>
                      <span>{getEmoji(item.weather[0].main)}</span>
                      <p className="hour-temp">{Math.round(item.main.temp)}°</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7-DAY FORECAST */}
            {dailyForecast.length > 0 && (
              <div className="section">
                <div className="section-title">7-Day Forecast &gt;</div>
                <div className="weekly">
                  {dailyForecast.map((item, i) => (
                    <div key={i} className="day-row">
                      <span className="day-emoji">{getEmoji(item.weather[0].main)}</span>
                      <span className="day-name">
                        {i === 0 ? 'Today' : new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}
                      </span>
                      <div className="day-bar"><div className="day-bar-fill"></div></div>
                      <span className="day-temps">{Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;