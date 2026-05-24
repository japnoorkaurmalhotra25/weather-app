import React from 'react';

const getWeatherEmoji = (main) => {
  const map = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️',
    Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️',
    Mist: '🌫️', Haze: '🌫️', Fog: '🌫️',
  };
  return map[main] || '🌡️';
};

const WeatherCard = ({ data }) => {
  if (!data) return null;
  const { name, sys, main, weather, wind, visibility } = data;
  const emoji = getWeatherEmoji(weather[0].main);
  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <div>
          <h2 className="city-name">{name}, {sys.country}</h2>
          <p className="date-text">{date}</p>
        </div>
        <span className="weather-emoji">{emoji}</span>
      </div>

      <div className="weather-card__temp">
        <span className="temperature">{Math.round(main.temp)}°C</span>
        <span className="feels-like">Feels like {Math.round(main.feels_like)}°C</span>
      </div>

      <p className="weather-desc">{weather[0].description}</p>

      <div className="weather-card__stats">
        <div className="stat">
          <span className="stat-icon">💧</span>
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{main.humidity}%</span>
        </div>
        <div className="stat">
          <span className="stat-icon">🌬️</span>
          <span className="stat-label">Wind</span>
          <span className="stat-value">{wind.speed} m/s</span>
        </div>
        <div className="stat">
          <span className="stat-icon">👁️</span>
          <span className="stat-label">Visibility</span>
          <span className="stat-value">{(visibility / 1000).toFixed(1)} km</span>
        </div>
        <div className="stat">
          <span className="stat-icon">🔼</span>
          <span className="stat-label">Max</span>
          <span className="stat-value">{Math.round(main.temp_max)}°C</span>
        </div>
        <div className="stat">
          <span className="stat-icon">🔽</span>
          <span className="stat-label">Min</span>
          <span className="stat-value">{Math.round(main.temp_min)}°C</span>
        </div>
        <div className="stat">
          <span className="stat-icon">📊</span>
          <span className="stat-label">Pressure</span>
          <span className="stat-value">{main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;