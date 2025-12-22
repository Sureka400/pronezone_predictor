# ✅ WORKING SETUP - Smart City Dashboard

## 🎉 SUCCESS! Both services are now running:

- **Backend API**: http://localhost:3001
- **Frontend App**: http://localhost:3000

## 🚀 How to Start (Every Time)

### Method 1: Using Batch Files (Easiest)

1. **Start Backend**: Double-click `start-backend.bat`
2. **Start Frontend**: Double-click `start-frontend.bat` (in a new window)

### Method 2: Manual Commands

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 🔍 Verify Everything is Working

1. **Backend Health**: http://localhost:3001/health
   - Should show: `{"status":"OK",...}`

2. **API Test**: http://localhost:3001/api/risk/zones
   - Should show risk zones data

3. **Frontend App**: http://localhost:3000
   - Should show the Smart City Dashboard

## 📊 What You'll See

### Dashboard Features Working:
✅ **Risk Zones Map** - Interactive zones with click details
✅ **Weather Widget** - Current weather (demo data initially)
✅ **Statistics Cards** - Live updating metrics
✅ **Recent Alerts** - Risk notifications
✅ **Quick Actions** - Interactive buttons

### Backend APIs Available:
✅ **Maps**: `/api/maps/geocode`, `/api/maps/directions`
✅ **Weather**: `/api/weather/current`, `/api/weather/forecast`
✅ **Risk**: `/api/risk/zones`, `/api/risk/analyze`

## 🔧 Configuration Files Created

- `backend/.env` - Backend configuration (API keys)
- `.env.local` - Frontend configuration (API URL)
- `start-backend.bat` - Backend startup script
- `start-frontend.bat` - Frontend startup script

## 🔑 To Enable Real Data (Optional)

### 1. Google Maps API Key
```bash
# Edit backend/.env
GOOGLE_MAPS_API_KEY=your_real_google_maps_key
```

### 2. Weather API Key
```bash
# Edit backend/.env
OPENWEATHER_API_KEY=your_real_openweather_key
```

**Get API Keys:**
- Google Maps: https://console.cloud.google.com/
- OpenWeather: https://openweathermap.org/api

## 🛠️ Troubleshooting

### If Backend Won't Start:
```bash
# Kill any process using port 3001
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

### If Frontend Won't Start:
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### If API Calls Fail:
1. Check backend is running: http://localhost:3001/health
2. Check `.env.local` has: `VITE_API_BASE_URL=http://localhost:3001/api`
3. Check browser console for CORS errors

## 📱 Expected User Experience

1. **Landing Page**: Animated hero with city statistics
2. **Dashboard**: Live risk zones, weather, and metrics
3. **Heatmap**: Interactive risk visualization
4. **Predictions**: AI risk analysis interface
5. **Results**: Detailed prediction results
6. **Insights**: Analytics and charts

## 🎯 Demo vs Real Data

### Demo Mode (No API Keys):
- Mock weather data
- Simulated risk zones
- Static map placeholders
- All UI features work

### Full Mode (With API Keys):
- Real weather from OpenWeatherMap
- Google Maps integration
- Live traffic data
- Geocoding services

## 🔄 To Stop Services

1. **Backend**: Press `Ctrl+C` in backend terminal
2. **Frontend**: Press `Ctrl+C` in frontend terminal
3. **Or close the terminal windows**

## 📞 Quick Test URLs

- **Health Check**: http://localhost:3001/health
- **Risk Zones**: http://localhost:3001/api/risk/zones
- **Weather Demo**: http://localhost:3001/api/weather/current?city=London
- **Frontend**: http://localhost:3000

---

## 🎊 You're All Set!

Your Smart City Dashboard is now running with:
- ✅ Backend API server
- ✅ Frontend React app
- ✅ Risk analysis system
- ✅ Weather integration
- ✅ Maps functionality

**Open http://localhost:3000 to see your dashboard!**