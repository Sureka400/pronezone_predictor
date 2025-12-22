import { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';

export const useWeather = (lat, lng, units = 'metric') => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await weatherApi.current(lat, lng, units);
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, units]);

  return { weather, loading, error };
};

export const useWeatherForecast = (lat, lng, days = 5, units = 'metric') => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await weatherApi.forecast(lat, lng, days, units);
        setForecast(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lng, days, units]);

  return { forecast, loading, error };
};