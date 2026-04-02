import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { getCurrentWeather, getForecast } from '../services/weatherService';

const getEmoji = (main) => {
  const map = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️',
    Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️',
    Mist: '🌫️', Haze: '🌫️'
  };
  return map[main] || '🌡️';
};

const Home = ({ theme, toggleTheme }) => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast(null);
    setSelectedDay(null);
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

  const dailyForecast = forecast
    ? Object.values(
        forecast.list.reduce((acc, item) => {
          const day = item.dt_txt.split(' ')[0];
          if (!acc[day]) acc[day] = item;
          return acc;
        }, {})
      ).slice(0, 7)
    : [];

  // Get all hourly slots for a specific day
  const getDayHourly = (dateStr) => {
    if (!forecast) return [];
    return forecast.list.filter(item => item.dt_txt.startsWith(dateStr));
  };

  const handleDayClick = (dateStr) => {
    setSelectedDay(prev => prev === dateStr ? null : dateStr);
  };

  const now = weather
    ? new Date().toLocaleString('en-US', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  return (
    <div className="home">
      <div className="overlay">

        {/* TOP BAR */}
        <div className="top-bar">
          <div className="logo">🌤 WeatherCast</div>
          <SearchBar onSearch={handleSearch} loading={loading} />
          <div className="top-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'night' ? '☀️ Day' : '🌙 Night'}
            </button>
           
          </div>
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
                      <span>{getEmoji(i === 0 ? weather.weather[0].main : item.weather[0].main)}</span>
                      <p className="hour-temp">
                        {i === 0 ? Math.round(weather.main.temp) : Math.round(item.main.temp)}°
                      </p>
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
                  {dailyForecast.map((item, i) => {
                    const dateStr = item.dt_txt.split(' ')[0];
                    const isSelected = selectedDay === dateStr;
                    const hourlySlots = getDayHourly(dateStr);
                    const fullDate = new Date(item.dt_txt).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric'
                    });

                    return (
                      <div key={i}>
                        {/* DAY ROW — clickable */}
                        <div
                          className={`day-row ${isSelected ? 'day-row-active' : ''}`}
                          onClick={() => handleDayClick(dateStr)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="day-emoji">{getEmoji(item.weather[0].main)}</span>
                          <span className="day-name">
                            {i === 0 ? 'Today' : new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}
                          </span>
                          <div className="day-bar"><div className="day-bar-fill"></div></div>
                          <span className="day-temps">
                            {Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°
                          </span>
                          <span className="day-arrow">{isSelected ? '▲' : '▼'}</span>
                        </div>

                        {/* EXPANDED DAY DETAIL */}
                        {isSelected && (
                          <div className="day-expanded">
                            <p className="day-expanded-title">📅 {fullDate}</p>

                            {hourlySlots.length > 0 ? (
                              <div className="day-expanded-grid">
                                {hourlySlots.map((slot, j) => (
                                  <div key={j} className="day-slot">
                                    <p className="slot-time">
                                      {new Date(slot.dt_txt).toLocaleTimeString('en-US', {
                                        hour: '2-digit', minute: '2-digit'
                                      })}
                                    </p>
                                    <span className="slot-emoji">{getEmoji(slot.weather[0].main)}</span>
                                    <p className="slot-temp">{Math.round(slot.main.temp)}°</p>
                                    <p className="slot-desc">{slot.weather[0].description}</p>
                                    <div className="slot-stats">
                                      <span>💧 {slot.main.humidity}%</span>
                                      <span>🌬️ {slot.wind.speed} km/h</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="no-data">No detailed data available for this day.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
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