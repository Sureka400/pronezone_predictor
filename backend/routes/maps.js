import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import { validateCoordinates, validateAddress } from '../utils/validation.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: parseInt(process.env.MAPS_CACHE_TTL) || 3600 });

// Google Maps API base URL
const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api';

/**
 * GET /api/maps/geocode
 * Convert address to coordinates
 */
router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: 'Address parameter is required' });
    }

    const validation = validateAddress(address);
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    // Check cache first
    const cacheKey = `geocode_${address}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/geocode/json`, {
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Geocoding failed', 
        details: response.data.status 
      });
    }

    const result = {
      address: response.data.results[0].formatted_address,
      coordinates: response.data.results[0].geometry.location,
      placeId: response.data.results[0].place_id,
      types: response.data.results[0].types
    };

    // Cache the result
    cache.set(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

/**
 * GET /api/maps/reverse-geocode
 * Convert coordinates to address
 */
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    // Check cache first
    const cacheKey = `reverse_geocode_${lat}_${lng}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/geocode/json`, {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Reverse geocoding failed', 
        details: response.data.status 
      });
    }

    const result = {
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      address: response.data.results[0].formatted_address,
      placeId: response.data.results[0].place_id,
      addressComponents: response.data.results[0].address_components
    };

    // Cache the result
    cache.set(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Failed to reverse geocode coordinates' });
  }
});

/**
 * GET /api/maps/places/nearby
 * Find nearby places of interest
 */
router.get('/places/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 1000, type = 'point_of_interest' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    // Check cache first
    const cacheKey = `nearby_${lat}_${lng}_${radius}_${type}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/place/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Places search failed', 
        details: response.data.status 
      });
    }

    const result = {
      places: response.data.results.map(place => ({
        placeId: place.place_id,
        name: place.name,
        coordinates: place.geometry.location,
        rating: place.rating,
        types: place.types,
        vicinity: place.vicinity,
        priceLevel: place.price_level,
        openNow: place.opening_hours?.open_now
      })),
      nextPageToken: response.data.next_page_token
    };

    // Cache the result
    cache.set(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Places search error:', error);
    res.status(500).json({ error: 'Failed to search nearby places' });
  }
});

/**
 * GET /api/maps/directions
 * Get directions between two points
 */
router.get('/directions', async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination parameters are required' });
    }

    // Check cache first
    const cacheKey = `directions_${origin}_${destination}_${mode}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/directions/json`, {
      params: {
        origin,
        destination,
        mode,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Directions request failed', 
        details: response.data.status 
      });
    }

    const route = response.data.routes[0];
    const result = {
      distance: route.legs[0].distance,
      duration: route.legs[0].duration,
      startAddress: route.legs[0].start_address,
      endAddress: route.legs[0].end_address,
      steps: route.legs[0].steps.map(step => ({
        instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
        distance: step.distance,
        duration: step.duration,
        startLocation: step.start_location,
        endLocation: step.end_location
      })),
      polyline: route.overview_polyline.points
    };

    // Cache the result
    cache.set(cacheKey, result);

    res.json(result);
  } catch (error) {
    console.error('Directions error:', error);
    res.status(500).json({ error: 'Failed to get directions' });
  }
});

/**
 * GET /api/maps/traffic
 * Get traffic information for a specific area
 */
router.get('/traffic', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    // Check cache first (shorter TTL for traffic data)
    const cacheKey = `traffic_${lat}_${lng}_${radius}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Simulate traffic data (in real implementation, you'd use Google Maps Roads API or similar)
    const trafficData = {
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
      radius: parseInt(radius),
      trafficLevel: Math.random() > 0.5 ? 'heavy' : Math.random() > 0.3 ? 'moderate' : 'light',
      congestionScore: Math.floor(Math.random() * 100),
      averageSpeed: Math.floor(Math.random() * 60) + 20, // 20-80 km/h
      incidents: Math.floor(Math.random() * 5),
      timestamp: new Date().toISOString()
    };

    // Cache with shorter TTL for traffic data
    cache.set(cacheKey, trafficData, 300); // 5 minutes

    res.json(trafficData);
  } catch (error) {
    console.error('Traffic data error:', error);
    res.status(500).json({ error: 'Failed to get traffic information' });
  }
});

/**
 * GET /api/maps/static-map
 * Generate static map URL
 */
router.get('/static-map', (req, res) => {
  try {
    const { 
      center, 
      zoom = 13, 
      size = '600x400', 
      maptype = 'roadmap',
      markers 
    } = req.query;
    
    if (!center) {
      return res.status(400).json({ error: 'Center parameter is required' });
    }

    const params = new URLSearchParams({
      center,
      zoom,
      size,
      maptype,
      key: process.env.GOOGLE_MAPS_API_KEY
    });

    if (markers) {
      params.append('markers', markers);
    }

    const staticMapUrl = `${GOOGLE_MAPS_BASE_URL}/staticmap?${params.toString()}`;

    res.json({
      url: staticMapUrl,
      parameters: {
        center,
        zoom: parseInt(zoom),
        size,
        maptype,
        markers
      }
    });
  } catch (error) {
    console.error('Static map error:', error);
    res.status(500).json({ error: 'Failed to generate static map URL' });
  }
});

export default router;