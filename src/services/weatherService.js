import axios from 'axios';

const BASE = '/api/weather';

export const getCurrentWeather = async (city) => {
  const { data } = await axios.get(`${BASE}/current`, { params: { city } });
  return data;
};

export const getForecast = async (city) => {
  const { data } = await axios.get(`${BASE}/forecast`, { params: { city } });
  return data;
};