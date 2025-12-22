import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

/**
 * FREE WEATHER API - Open-Meteo (No API key required)
 * GET /api/free-apis/weather/current
 */
router.get('/weather/current', async (req, res) => {
  try {
    const { lat, lng, city } = req.query;
    
    let latitude, longitude;
    
    if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    } else if (city) {
      // Use free geocoding service for city name
      const geocodeResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      
      if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
        return res.status(404).json({ error: 'City not found' });
      }
      
      latitude = geocodeResponse.data.results[0].latitude;
      longitude = geocodeResponse.data.results[0].longitude;
    } else {
      return res.status(400).json({ error: 'Either coordinates (lat, lng) or city parameter is required' });
    }

    const cacheKey = `free_weather_${latitude}_${longitude}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Open-Meteo API (completely free, no API key needed)
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`
    );

    const weatherData = {
      location: {
        name: city || `${latitude}, ${longitude}`,
        coordinates: { lat: latitude, lng: longitude }
      },
      current: {
        temperature: response.data.current_weather.temperature,
        windSpeed: response.data.current_weather.windspeed,
        windDirection: response.data.current_weather.winddirection,
        weatherCode: response.data.current_weather.weathercode,
        condition: getWeatherCondition(response.data.current_weather.weathercode),
        time: response.data.current_weather.time
      },
      hourly: {
        temperature: response.data.hourly.temperature_2m.slice(0, 24),
        humidity: response.data.hourly.relative_humidity_2m.slice(0, 24),
        windSpeed: response.data.hourly.wind_speed_10m.slice(0, 24),
        windDirection: response.data.hourly.wind_direction_10m.slice(0, 24)
      },
      timestamp: new Date().toISOString(),
      source: 'Open-Meteo (Free)',
      units: {
        temperature: '°C',
        windSpeed: 'km/h'
      }
    };

    cache.set(cacheKey, weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error('Free weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

/**
 * FREE GEOCODING API - Open-Meteo Geocoding
 * GET /api/free-apis/geocode
 */
router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const cacheKey = `free_geocode_${address}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(address)}&count=5`
    );

    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const results = response.data.results.map(result => ({
      name: result.name,
      country: result.country,
      coordinates: {
        lat: result.latitude,
        lng: result.longitude
      },
      admin1: result.admin1,
      admin2: result.admin2,
      timezone: result.timezone
    }));

    const geocodeData = {
      query: address,
      results,
      source: 'Open-Meteo Geocoding (Free)',
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, geocodeData);
    res.json(geocodeData);
  } catch (error) {
    console.error('Free geocoding error:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

/**
 * FREE REVERSE GEOCODING - Using Nominatim (OpenStreetMap)
 * GET /api/free-apis/reverse-geocode
 */
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const cacheKey = `free_reverse_${lat}_${lng}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Nominatim API (OpenStreetMap - Free)
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SmartCityDashboard/1.0'
        }
      }
    );

    const reverseData = {
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      address: response.data.display_name,
      details: {
        house_number: response.data.address?.house_number,
        road: response.data.address?.road,
        city: response.data.address?.city || response.data.address?.town || response.data.address?.village,
        state: response.data.address?.state,
        country: response.data.address?.country,
        postcode: response.data.address?.postcode
      },
      source: 'Nominatim (OpenStreetMap - Free)',
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, reverseData);
    res.json(reverseData);
  } catch (error) {
    console.error('Free reverse geocoding error:', error);
    res.status(500).json({ error: 'Failed to reverse geocode coordinates' });
  }
});

/**
 * FREE PLACES SEARCH - Using Overpass API (OpenStreetMap)
 * GET /api/free-apis/places/nearby
 */
router.get('/places/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 1000, type = 'amenity' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const cacheKey = `free_places_${lat}_${lng}_${radius}_${type}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Overpass API query for nearby places
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["${type}"](around:${radius},${lat},${lng});
        way["${type}"](around:${radius},${lat},${lng});
        relation["${type}"](around:${radius},${lat},${lng});
      );
      out center meta;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      overpassQuery,
      {
        headers: {
          'Content-Type': 'text/plain'
        }
      }
    );

    const places = response.data.elements.map(element => ({
      id: element.id,
      name: element.tags?.name || 'Unnamed',
      type: element.tags?.[type],
      coordinates: {
        lat: element.lat || element.center?.lat,
        lng: element.lon || element.center?.lon
      },
      tags: element.tags,
      distance: calculateDistance(
        parseFloat(lat), parseFloat(lng),
        element.lat || element.center?.lat,
        element.lon || element.center?.lon
      )
    })).filter(place => place.coordinates.lat && place.coordinates.lng)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20); // Limit to 20 results

    const placesData = {
      query: { lat: parseFloat(lat), lng: parseFloat(lng), radius: parseInt(radius), type },
      places,
      source: 'Overpass API (OpenStreetMap - Free)',
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, placesData);
    res.json(placesData);
  } catch (error) {
    console.error('Free places search error:', error);
    res.status(500).json({ error: 'Failed to search nearby places' });
  }
});

// Helper functions
function getWeatherCondition(code) {
  const conditions = {
    0: { main: 'Clear', description: 'Clear sky' },
    1: { main: 'Clouds', description: 'Mainly clear' },
    2: { main: 'Clouds', description: 'Partly cloudy' },
    3: { main: 'Clouds', description: 'Overcast' },
    45: { main: 'Fog', description: 'Fog' },
    48: { main: 'Fog', description: 'Depositing rime fog' },
    51: { main: 'Drizzle', description: 'Light drizzle' },
    53: { main: 'Drizzle', description: 'Moderate drizzle' },
    55: { main: 'Drizzle', description: 'Dense drizzle' },
    61: { main: 'Rain', description: 'Slight rain' },
    63: { main: 'Rain', description: 'Moderate rain' },
    65: { main: 'Rain', description: 'Heavy rain' },
    71: { main: 'Snow', description: 'Slight snow fall' },
    73: { main: 'Snow', description: 'Moderate snow fall' },
    75: { main: 'Snow', description: 'Heavy snow fall' },
    95: { main: 'Thunderstorm', description: 'Thunderstorm' }
  };
  
  return conditions[code] || { main: 'Unknown', description: 'Unknown weather condition' };
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default router;