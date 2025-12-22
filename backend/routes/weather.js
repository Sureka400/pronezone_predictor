import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import { validateCoordinates, validateCity } from '../utils/validation.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: parseInt(process.env.WEATHER_CACHE_TTL) || 600 });

/**
 * GET /api/weather/current
 * Get current weather for coordinates or city
 */
router.get('/current', async (req, res) => {
  try {
    const { lat, lng, city, units = 'metric' } = req.query;
    
    if (!lat && !lng && !city) {
      return res.status(400).json({ 
        error: 'Either coordinates (lat, lng) or city parameter is required' 
      });
    }

    let queryParam;
    let cacheKey;

    if (lat && lng) {
      const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      queryParam = `lat=${lat}&lon=${lng}`;
      cacheKey = `current_weather_${lat}_${lng}_${units}`;
    } else {
      const validation = validateCity(city);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      queryParam = `q=${encodeURIComponent(city)}`;
      cacheKey = `current_weather_${city}_${units}`;
    }

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(
      `${process.env.OPENWEATHER_BASE_URL}/weather?${queryParam}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const weatherData = {
      location: {
        name: response.data.name,
        country: response.data.sys.country,
        coordinates: response.data.coord
      },
      current: {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        visibility: response.data.visibility,
        uvIndex: null, // Not available in current weather endpoint
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        cloudCover: response.data.clouds.all,
        condition: {
          main: response.data.weather[0].main,
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon
        }
      },
      sun: {
        sunrise: new Date(response.data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(response.data.sys.sunset * 1000).toISOString()
      },
      timestamp: new Date().toISOString(),
      units: {
        temperature: units === 'metric' ? '°C' : '°F',
        windSpeed: units === 'metric' ? 'm/s' : 'mph',
        pressure: 'hPa',
        visibility: 'm'
      }
    };

    // Cache the result
    cache.set(cacheKey, weatherData);

    res.json(weatherData);
  } catch (error) {
    console.error('Current weather error:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(500).json({ error: 'Failed to fetch current weather data' });
  }
});

/**
 * GET /api/weather/forecast
 * Get weather forecast for coordinates or city
 */
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lng, city, units = 'metric', days = 5 } = req.query;
    
    if (!lat && !lng && !city) {
      return res.status(400).json({ 
        error: 'Either coordinates (lat, lng) or city parameter is required' 
      });
    }

    let queryParam;
    let cacheKey;

    if (lat && lng) {
      const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      queryParam = `lat=${lat}&lon=${lng}`;
      cacheKey = `forecast_${lat}_${lng}_${units}_${days}`;
    } else {
      const validation = validateCity(city);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      queryParam = `q=${encodeURIComponent(city)}`;
      cacheKey = `forecast_${city}_${units}_${days}`;
    }

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(
      `${process.env.OPENWEATHER_BASE_URL}/forecast?${queryParam}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    // Group forecast by days
    const forecastByDay = {};
    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!forecastByDay[date]) {
        forecastByDay[date] = [];
      }
      forecastByDay[date].push({
        time: new Date(item.dt * 1000).toISOString(),
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        cloudCover: item.clouds.all,
        condition: {
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        },
        precipitationProbability: item.pop * 100
      });
    });

    // Create daily summaries
    const dailyForecast = Object.entries(forecastByDay)
      .slice(0, parseInt(days))
      .map(([date, hourlyData]) => {
        const temps = hourlyData.map(h => h.temperature);
        const conditions = hourlyData.map(h => h.condition.main);
        const mostCommonCondition = conditions.sort((a, b) =>
          conditions.filter(v => v === a).length - conditions.filter(v => v === b).length
        ).pop();

        return {
          date,
          temperature: {
            min: Math.min(...temps),
            max: Math.max(...temps),
            average: temps.reduce((a, b) => a + b, 0) / temps.length
          },
          condition: {
            main: mostCommonCondition,
            description: hourlyData.find(h => h.condition.main === mostCommonCondition)?.condition.description
          },
          humidity: hourlyData.reduce((a, b) => a + b.humidity, 0) / hourlyData.length,
          windSpeed: hourlyData.reduce((a, b) => a + b.windSpeed, 0) / hourlyData.length,
          precipitationProbability: Math.max(...hourlyData.map(h => h.precipitationProbability)),
          hourlyData
        };
      });

    const forecastData = {
      location: {
        name: response.data.city.name,
        country: response.data.city.country,
        coordinates: response.data.city.coord
      },
      forecast: dailyForecast,
      timestamp: new Date().toISOString(),
      units: {
        temperature: units === 'metric' ? '°C' : '°F',
        windSpeed: units === 'metric' ? 'm/s' : 'mph',
        pressure: 'hPa'
      }
    };

    // Cache the result
    cache.set(cacheKey, forecastData);

    res.json(forecastData);
  } catch (error) {
    console.error('Forecast error:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(500).json({ error: 'Failed to fetch weather forecast' });
  }
});

/**
 * GET /api/weather/alerts
 * Get weather alerts for coordinates or city
 */
router.get('/alerts', async (req, res) => {
  try {
    const { lat, lng, city } = req.query;
    
    if (!lat && !lng && !city) {
      return res.status(400).json({ 
        error: 'Either coordinates (lat, lng) or city parameter is required' 
      });
    }

    let queryParam;
    let cacheKey;

    if (lat && lng) {
      const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      queryParam = `lat=${lat}&lon=${lng}`;
      cacheKey = `alerts_${lat}_${lng}`;
    } else {
      const validation = validateCity(city);
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
      queryParam = `q=${encodeURIComponent(city)}`;
      cacheKey = `alerts_${city}`;
    }

    // Check cache first (shorter TTL for alerts)
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Use One Call API for alerts (requires different endpoint)
    const response = await axios.get(
      `${process.env.OPENWEATHER_BASE_URL.replace('/data/2.5', '/data/3.0')}/onecall?${queryParam}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const alertsData = {
      location: {
        coordinates: { lat: response.data.lat, lng: response.data.lon }
      },
      alerts: response.data.alerts ? response.data.alerts.map(alert => ({
        event: alert.event,
        start: new Date(alert.start * 1000).toISOString(),
        end: new Date(alert.end * 1000).toISOString(),
        description: alert.description,
        sender: alert.sender_name,
        tags: alert.tags
      })) : [],
      timestamp: new Date().toISOString()
    };

    // Cache with shorter TTL for alerts
    cache.set(cacheKey, alertsData, 300); // 5 minutes

    res.json(alertsData);
  } catch (error) {
    console.error('Weather alerts error:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Location not found' });
    }
    // If One Call API fails, return empty alerts
    res.json({
      location: { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } },
      alerts: [],
      timestamp: new Date().toISOString(),
      note: 'Weather alerts require One Call API subscription'
    });
  }
});

/**
 * GET /api/weather/historical
 * Get historical weather data
 */
router.get('/historical', async (req, res) => {
  try {
    const { lat, lng, date, units = 'metric' } = req.query;
    
    if (!lat || !lng || !date) {
      return res.status(400).json({ 
        error: 'Latitude, longitude, and date parameters are required' 
      });
    }

    const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    const timestamp = Math.floor(new Date(date).getTime() / 1000);
    const cacheKey = `historical_${lat}_${lng}_${timestamp}_${units}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Historical data requires One Call API
    const response = await axios.get(
      `${process.env.OPENWEATHER_BASE_URL.replace('/data/2.5', '/data/3.0')}/onecall/timemachine?lat=${lat}&lon=${lng}&dt=${timestamp}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const historicalData = {
      location: {
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
      },
      date: new Date(timestamp * 1000).toISOString(),
      data: {
        temperature: response.data.data[0].temp,
        feelsLike: response.data.data[0].feels_like,
        humidity: response.data.data[0].humidity,
        pressure: response.data.data[0].pressure,
        windSpeed: response.data.data[0].wind_speed,
        windDirection: response.data.data[0].wind_deg,
        cloudCover: response.data.data[0].clouds,
        condition: {
          main: response.data.data[0].weather[0].main,
          description: response.data.data[0].weather[0].description,
          icon: response.data.data[0].weather[0].icon
        }
      },
      timestamp: new Date().toISOString(),
      units: {
        temperature: units === 'metric' ? '°C' : '°F',
        windSpeed: units === 'metric' ? 'm/s' : 'mph',
        pressure: 'hPa'
      }
    };

    // Cache the result (longer TTL for historical data)
    cache.set(cacheKey, historicalData, 86400); // 24 hours

    res.json(historicalData);
  } catch (error) {
    console.error('Historical weather error:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Historical data not found' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch historical weather data',
      note: 'Historical data requires One Call API subscription'
    });
  }
});

/**
 * GET /api/weather/air-quality
 * Get air quality data for coordinates
 */
router.get('/air-quality', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Latitude and longitude parameters are required' 
      });
    }

    const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    const cacheKey = `air_quality_${lat}_${lng}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(
      `${process.env.OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const airQualityData = {
      location: {
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
      },
      airQuality: {
        index: response.data.list[0].main.aqi,
        indexDescription: ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][response.data.list[0].main.aqi - 1],
        components: response.data.list[0].components
      },
      timestamp: new Date(response.data.list[0].dt * 1000).toISOString()
    };

    // Cache the result
    cache.set(cacheKey, airQualityData);

    res.json(airQualityData);
  } catch (error) {
    console.error('Air quality error:', error);
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

export default router;