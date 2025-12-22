# Smart City Backend API

A comprehensive backend service for the Smart City Dashboard providing Google Maps integration, weather data, and risk analysis capabilities.

## 🚀 Features

### **Google Maps Integration**
- **Geocoding**: Convert addresses to coordinates and vice versa
- **Places Search**: Find nearby points of interest
- **Directions**: Get routing information between locations
- **Traffic Data**: Real-time traffic information
- **Static Maps**: Generate static map URLs

### **Weather Services**
- **Current Weather**: Real-time weather conditions
- **Weather Forecast**: Multi-day weather predictions
- **Weather Alerts**: Severe weather notifications
- **Historical Data**: Past weather information
- **Air Quality**: Air pollution and quality indices

### **Risk Analysis**
- **Risk Zones**: Identify accident-prone areas
- **Risk Prediction**: AI-powered risk forecasting
- **Multi-factor Analysis**: Weather, traffic, and infrastructure integration
- **Real-time Updates**: Dynamic risk assessment

## 📋 Prerequisites

- Node.js 18+ 
- Google Maps API Key
- OpenWeatherMap API Key (or WeatherAPI.com)

## 🛠 Installation

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

3. **Configure API Keys**
Edit `.env` file with your API keys:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔑 API Keys Setup

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Directions API
   - Roads API (optional)
4. Create credentials (API Key)
5. Restrict the key to your domain/IP

### OpenWeatherMap API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. For advanced features (alerts, historical), consider paid plans

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
Currently using API keys in environment variables. For production, implement proper authentication.

## 🗺️ Maps Endpoints

### Geocoding
```http
GET /api/maps/geocode?address=New York, NY
```

### Reverse Geocoding
```http
GET /api/maps/reverse-geocode?lat=40.7589&lng=-73.9851
```

### Nearby Places
```http
GET /api/maps/places/nearby?lat=40.7589&lng=-73.9851&radius=1000&type=restaurant
```

### Directions
```http
GET /api/maps/directions?origin=New York&destination=Boston&mode=driving
```

### Traffic Information
```http
GET /api/maps/traffic?lat=40.7589&lng=-73.9851&radius=5000
```

### Static Map URL
```http
GET /api/maps/static-map?center=40.7589,-73.9851&zoom=13&size=600x400
```

## 🌤️ Weather Endpoints

### Current Weather
```http
GET /api/weather/current?lat=40.7589&lng=-73.9851&units=metric
# OR
GET /api/weather/current?city=New York&units=metric
```

### Weather Forecast
```http
GET /api/weather/forecast?lat=40.7589&lng=-73.9851&days=5&units=metric
```

### Weather Alerts
```http
GET /api/weather/alerts?lat=40.7589&lng=-73.9851
```

### Historical Weather
```http
GET /api/weather/historical?lat=40.7589&lng=-73.9851&date=2023-12-01&units=metric
```

### Air Quality
```http
GET /api/weather/air-quality?lat=40.7589&lng=-73.9851
```

## ⚠️ Risk Analysis Endpoints

### Risk Zones
```http
GET /api/risk/zones?lat=40.7589&lng=-73.9851&radius=5000
```

### Risk Analysis
```http
POST /api/risk/analyze
Content-Type: application/json

{
  "coordinates": { "lat": 40.7589, "lng": -73.9851 },
  "weatherData": { "condition": "rain", "windSpeed": 20 },
  "trafficData": { "congestionLevel": "heavy" },
  "timeOfDay": "evening",
  "factors": { "construction": true, "schoolZone": false }
}
```

### Risk Predictions
```http
GET /api/risk/predictions?lat=40.7589&lng=-73.9851&hours=6
```

## 📊 Response Format

### Success Response
```json
{
  "data": { ... },
  "timestamp": "2023-12-19T10:30:00.000Z",
  "cached": false
}
```

### Error Response
```json
{
  "error": "Error message",
  "timestamp": "2023-12-19T10:30:00.000Z",
  "path": "/api/endpoint"
}
```

## 🔧 Configuration

### Environment Variables
```env
# Server
PORT=3001
NODE_ENV=development

# APIs
GOOGLE_MAPS_API_KEY=your_key
OPENWEATHER_API_KEY=your_key

# Caching
CACHE_TTL_SECONDS=300
WEATHER_CACHE_TTL=600
MAPS_CACHE_TTL=3600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Cache Configuration
- **Weather data**: 10 minutes TTL
- **Maps data**: 1 hour TTL
- **Risk zones**: 5 minutes TTL
- **Traffic data**: 5 minutes TTL

### Rate Limiting
- **100 requests per 15 minutes** per IP
- Configurable via environment variables

## 🚀 Frontend Integration

### React Example
```javascript
// Weather service
const getWeather = async (lat, lng) => {
  const response = await fetch(
    `http://localhost:3001/api/weather/current?lat=${lat}&lng=${lng}`
  );
  return response.json();
};

// Maps service
const geocodeAddress = async (address) => {
  const response = await fetch(
    `http://localhost:3001/api/maps/geocode?address=${encodeURIComponent(address)}`
  );
  return response.json();
};

// Risk analysis
const analyzeRisk = async (coordinates, weatherData, trafficData) => {
  const response = await fetch('http://localhost:3001/api/risk/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coordinates,
      weatherData,
      trafficData,
      timeOfDay: 'evening'
    })
  });
  return response.json();
};
```

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Joi schema validation
- **Error Handling**: Secure error responses

## 📈 Performance

- **Caching**: Redis-like in-memory caching
- **Compression**: Gzip compression
- **Validation**: Input sanitization
- **Async/Await**: Non-blocking operations

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl http://localhost:3001/health
```

## 🚀 Deployment

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup
1. Set production environment variables
2. Configure proper CORS origins
3. Set up SSL/TLS certificates
4. Configure reverse proxy (nginx)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built for safer, smarter cities** 🏙️