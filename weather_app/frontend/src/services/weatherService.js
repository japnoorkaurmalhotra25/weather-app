import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const BASE = `${API_BASE_URL}/api/weather`;

export const getCurrentWeather = async (city) => {
  const { data } = await axios.get(`${BASE}/current`, {
    params: { city },
  });

  return data;
};

export const getForecast = async (city) => {
  const { data } = await axios.get(`${BASE}/forecast`, {
    params: { city },
  });

  return data;
};