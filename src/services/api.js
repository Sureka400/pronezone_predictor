// API service for Smart City Backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Maps API methods
  async geocodeAddress(address) {
    try {
      return await this.request(`/maps/geocode?address=${encodeURIComponent(address)}`);
    } catch (error) {
      // Fallback to free geocoding API
      console.log('Falling back to free geocoding API');
      return await this.request(`/free-apis/geocode?address=${encodeURIComponent(address)}`);
    }
  }

  async reverseGeocode(lat, lng) {
    try {
      return await this.request(`/maps/reverse-geocode?lat=${lat}&lng=${lng}`);
    } catch (error) {
      // Fallback to free reverse geocoding API
      console.log('Falling back to free reverse geocoding API');
      return await this.request(`/free-apis/reverse-geocode?lat=${lat}&lng=${lng}`);
    }
  }

  async getNearbyPlaces(lat, lng, radius = 1000, type = 'point_of_interest') {
    return this.request(`/maps/places/nearby?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}`);
  }

  async getDirections(origin, destination, mode = 'driving') {
    return this.request(`/maps/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}`);
  }

  async getTrafficInfo(lat, lng, radius = 5000) {
    return this.request(`/maps/traffic?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  async getStaticMapUrl(center, zoom = 13, size = '600x400', maptype = 'roadmap', markers = '') {
    return this.request(`/maps/static-map?center=${center}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${markers}`);
  }

  // Weather API methods
  async getCurrentWeather(lat, lng, units = 'metric') {
    try {
      return await this.request(`/weather/current?lat=${lat}&lng=${lng}&units=${units}`);
    } catch (error) {
      // Fallback to free API if main weather API fails
      console.log('Falling back to free weather API');
      return await this.request(`/free-apis/weather/current?lat=${lat}&lng=${lng}`);
    }
  }

  async getCurrentWeatherByCity(city, units = 'metric') {
    try {
      return await this.request(`/weather/current?city=${encodeURIComponent(city)}&units=${units}`);
    } catch (error) {
      // Fallback to free API if main weather API fails
      console.log('Falling back to free weather API');
      return await this.request(`/free-apis/weather/current?city=${encodeURIComponent(city)}`);
    }
  }

  async getWeatherForecast(lat, lng, days = 5, units = 'metric') {
    return this.request(`/weather/forecast?lat=${lat}&lng=${lng}&days=${days}&units=${units}`);
  }

  async getWeatherAlerts(lat, lng) {
    return this.request(`/weather/alerts?lat=${lat}&lng=${lng}`);
  }

  async getHistoricalWeather(lat, lng, date, units = 'metric') {
    return this.request(`/weather/historical?lat=${lat}&lng=${lng}&date=${date}&units=${units}`);
  }

  async getAirQuality(lat, lng) {
    return this.request(`/weather/air-quality?lat=${lat}&lng=${lng}`);
  }

  // Risk Analysis API methods
  async getRiskZones(lat = null, lng = null, radius = 5000) {
    const params = new URLSearchParams();
    if (lat && lng) {
      params.append('lat', lat);
      params.append('lng', lng);
    }
    params.append('radius', radius);
    
    return this.request(`/risk/zones?${params.toString()}`);
  }

  async analyzeRisk(coordinates, weatherData = null, trafficData = null, timeOfDay = null, factors = null) {
    return this.request('/risk/analyze', {
      method: 'POST',
      body: JSON.stringify({
        coordinates,
        weatherData,
        trafficData,
        timeOfDay,
        factors
      })
    });
  }

  async getRiskPredictions(lat, lng, hours = 6) {
    return this.request(`/risk/predictions?lat=${lat}&lng=${lng}&hours=${hours}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { baseURL: this.baseURL.replace('/api', '') });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Named exports for specific services
export const mapsApi = {
  geocode: (address) => apiService.geocodeAddress(address),
  reverseGeocode: (lat, lng) => apiService.reverseGeocode(lat, lng),
  nearbyPlaces: (lat, lng, radius, type) => apiService.getNearbyPlaces(lat, lng, radius, type),
  directions: (origin, destination, mode) => apiService.getDirections(origin, destination, mode),
  traffic: (lat, lng, radius) => apiService.getTrafficInfo(lat, lng, radius),
  staticMap: (center, zoom, size, maptype, markers) => apiService.getStaticMapUrl(center, zoom, size, maptype, markers)
};

export const weatherApi = {
  current: (lat, lng, units) => apiService.getCurrentWeather(lat, lng, units),
  currentByCity: (city, units) => apiService.getCurrentWeatherByCity(city, units),
  forecast: (lat, lng, days, units) => apiService.getWeatherForecast(lat, lng, days, units),
  alerts: (lat, lng) => apiService.getWeatherAlerts(lat, lng),
  historical: (lat, lng, date, units) => apiService.getHistoricalWeather(lat, lng, date, units),
  airQuality: (lat, lng) => apiService.getAirQuality(lat, lng)
};

export const riskApi = {
  zones: (lat, lng, radius) => apiService.getRiskZones(lat, lng, radius),
  analyze: (coordinates, weatherData, trafficData, timeOfDay, factors) => 
    apiService.analyzeRisk(coordinates, weatherData, trafficData, timeOfDay, factors),
  predictions: (lat, lng, hours) => apiService.getRiskPredictions(lat, lng, hours)
};