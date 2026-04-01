import React from "react";

export default function Forecast({ data }) {
  if (!data) return null;

  return (
    <div className="forecast">
      <h3>7-Day Forecast</h3>

      {data.list.slice(0, 7).map((item, index) => (
        <div key={index} className="forecast-item">
          <span>{new Date(item.dt_txt).toDateString()}</span>
          <span>{Math.round(item.main.temp)}°C</span>
        </div>
      ))}
    </div>
  );
}