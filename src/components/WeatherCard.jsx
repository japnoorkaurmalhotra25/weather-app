export default function WeatherCard({ data }) {
  if (!data) return null;

  return (
    <div className="weather-card">
      <div className="weather-card__header">
        <div>
          <h2 className="city-name">{data.name}</h2>
          <p className="date-text">{new Date().toDateString()}</p>
        </div>

        <span className="weather-emoji">
          {data.weather[0].main === "Clear" ? "☀️" : "🌤️"}
        </span>
      </div>

      <div className="weather-card__temp">
        <span className="temperature" style={{ fontSize: "4rem" }}>
  {Math.round(data.main.temp)}°C
</span>
        <span className="feels-like">
          Feels like {Math.round(data.main.feels_like)}°C
        </span>
      </div>

      <p className="weather-desc">{data.weather[0].description}</p>

      <div className="weather-card__stats">
        <div className="stat">
          <span className="stat-icon">💧</span>
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{data.main.humidity}%</span>
        </div>

        <div className="stat">
          <span className="stat-icon">🌬️</span>
          <span className="stat-label">Wind</span>
          <span className="stat-value">{data.wind.speed} m/s</span>
        </div>

        <div className="stat">
          <span className="stat-icon">🌡️</span>
          <span className="stat-label">Pressure</span>
          <span className="stat-value">{data.main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}