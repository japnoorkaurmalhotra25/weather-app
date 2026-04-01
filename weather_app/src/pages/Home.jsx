import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import Loader from '../components/Loader';
import { getCurrentWeather } from '../services/weatherService';

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const data = await getCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.response?.data?.error || 'City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <header className="app-header">
        <div className="header-content">
          <span className="header-logo">⛅</span>
          <div>
            <h1 className="app-title">WeatherCast</h1>
            <p className="app-subtitle">Real-time weather for any city</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && <Loader />}

        {error && (
          <div className="error-box">
            <span>⚠️</span> {error}
          </div>
        )}

        {!loading && !error && !weather && (
          <div className="placeholder">
            <span className="placeholder-icon">🌍</span>
            <p>Search for a city to get the weather</p>
            <small>Try: Delhi, Mumbai, New York, London</small>
          </div>
        )}

        {weather && <WeatherCard data={weather} />}
      </main>

      <footer className="app-footer">
        <p>Weather data by OpenWeatherMap · FSE Project — Evaluation 1</p>
      </footer>
    </div>
  );
};

export default Home;