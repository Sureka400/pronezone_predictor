# Smart City Dashboard - Complete Setup Guide

This guide will help you set up both the frontend React application and the backend API server with Google Maps and Weather integration.

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your API keys (see API Keys section below)
# nano .env  # or use your preferred editor
```

### 2. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install frontend dependencies (if not already done)
npm install

# Create frontend environment file
echo "VITE_API_BASE_URL=http://localhost:3001/api" > .env.local
```

### 3. Start Both Services

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend (in new terminal)
cd ..
npm run dev
```

## 🔑 API Keys Required

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Geocoding API** 
   - **Places API**
   - **Directions API**
4. Create credentials (API Key)
5. Copy the key to your `.env` file:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

### Weather API Key (OpenWeatherMap)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key from the dashboard
3. Add to your `.env` file:
   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

## 📁 Project Structure

```
smart-city-dashboard/
├── backend/                 # Node.js API server
│   ├── routes/             # API endpoints
│   │   ├── maps.js         # Google Maps integration
│   │   ├── weather.js      # Weather data
│   │   └── risk.js         # Risk analysis
│   ├── utils/              # Utilities
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env               # API keys (create from .env.example)
├── src/                    # React frontend
│   ├── services/           # API integration
│   │   └── api.js         # Backend API client
│   ├── hooks/             # Custom React hooks
│   │   ├── useWeather.js  # Weather data hook
│   │   └── useRiskZones.js # Risk zones hook
│   ├── components/        # React components
│   │   ├── WeatherWidget.jsx
│   │   └── RiskZoneMap.jsx
│   └── pages/             # Page components
└── setup.md              # This file
```

## 🧪 Testing the Integration

### 1. Test Backend Health
```bash
curl http://localhost:3001/health
```

### 2. Test Weather API
```bash
curl "http://localhost:3001/api/weather/current?city=New York"
```

### 3. Test Maps API
```bash
curl "http://localhost:3001/api/maps/geocode?address=New York, NY"
```

### 4. Test Risk Zones
```bash
curl "http://localhost:3001/api/risk/zones"
```

## 🔧 Configuration Options

### Backend Environment Variables
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# API Keys
GOOGLE_MAPS_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here

# Cache Settings
CACHE_TTL_SECONDS=300
WEATHER_CACHE_TTL=600
MAPS_CACHE_TTL=3600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🌐 Using the APIs in Frontend

### Weather Integration Example
```javascript
import { useWeather } from './hooks/useWeather';

function WeatherComponent() {
  const { weather, loading, error } = useWeather(40.7589, -73.9851);
  
  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h3>{weather.location.name}</h3>
      <p>{weather.current.temperature}°C</p>
      <p>{weather.current.condition.description}</p>
    </div>
  );
}
```

### Risk Zones Integration Example
```javascript
import { useRiskZones } from './hooks/useRiskZones';

function RiskZonesComponent() {
  const { zones, summary, loading } = useRiskZones();
  
  return (
    <div>
      <h3>Risk Zones Summary</h3>
      <p>High Risk: {summary?.highRisk}</p>
      <p>Medium Risk: {summary?.mediumRisk}</p>
      <p>Safe Zones: {summary?.lowRisk}</p>
    </div>
  );
}
```

## 🚀 Production Deployment

### Backend Deployment
```bash
# Build for production
cd backend
npm install --production

# Set production environment
export NODE_ENV=production
export PORT=3001

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "smart-city-api"
```

### Frontend Deployment
```bash
# Build frontend
npm run build

# Serve with nginx or similar
# Update VITE_API_BASE_URL to your production API URL
```

## 🔒 Security Considerations

1. **API Key Security**
   - Never commit `.env` files to version control
   - Use environment variables in production
   - Restrict API keys to specific domains/IPs

2. **CORS Configuration**
   - Update `ALLOWED_ORIGINS` for production domains
   - Remove localhost origins in production

3. **Rate Limiting**
   - Adjust rate limits based on your needs
   - Consider implementing user-based rate limiting

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGINS` in backend `.env`
   - Ensure frontend is running on allowed origin

2. **API Key Errors**
   - Verify API keys are correct in `.env`
   - Check API quotas and billing in Google Cloud Console
   - Ensure required APIs are enabled

3. **Connection Refused**
   - Make sure backend is running on port 3001
   - Check firewall settings
   - Verify `VITE_API_BASE_URL` in frontend

4. **Weather Data Not Loading**
   - Check OpenWeatherMap API key
   - Verify API quota limits
   - Check network connectivity

### Debug Mode
```bash
# Enable debug logging
export DEBUG=smart-city:*
npm run dev
```

## 📚 API Documentation

Once running, visit:
- Backend API: `http://localhost:3001`
- Frontend App: `http://localhost:5173`
- Health Check: `http://localhost:3001/health`

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all API keys are configured correctly
3. Ensure all required services are running
4. Check browser console for frontend errors
5. Check backend logs for API errors

---

**Happy coding! 🎉**