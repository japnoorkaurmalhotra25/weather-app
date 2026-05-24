const dailyForecastTemplate = ({
  name,
  city,
  temp,
  condition,
  humidity,
  wind,
  recommendation,
}) => {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Good morning ${name} ☀️</h2>

      <p>
        Here is your weather update for today in ${city}.
      </p>

      <ul>
        <li><strong>Temperature:</strong> ${temp}°C</li>
        <li><strong>Condition:</strong> ${condition}</li>
        <li><strong>Humidity:</strong> ${humidity}%</li>
         <li><strong>Wind Speed:</strong> ${wind} km/h</li>
      </ul>

      <h3>Recommendation</h3>
      <p>${recommendation}</p>

      <p>
        Have a great day,<br/>
        WeatherCast Team
      </p>
    </div>
  `;
};

module.exports = dailyForecastTemplate;