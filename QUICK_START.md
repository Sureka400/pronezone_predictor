# 🚀 QUICK START GUIDE - Smart City Dashboard

## Step 1: Install Dependencies

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup (if not done)
```bash
npm install
```

## Step 2: Start the Backend

### Option A: Using the batch file (Windows)
```bash
# Double-click start-backend.bat
# OR run in terminal:
start-backend.bat
```

### Option B: Manual start
```bash
cd backend
npm run dev
```

The backend will start on: **http://localhost:3001**

## Step 3: Start the Frontend

### Option A: Using the batch file (Windows)
```bash
# In a NEW terminal window, double-click start-frontend.bat
# OR run in terminal:
start-frontend.bat
```

### Option B: Manual start
```bash
# In a NEW terminal window:
npm run dev
```

The frontend will start on: **http://localhost:5173**

## Step 4: Test the Setup

1. **Backend Health Check**: Open http://localhost:3001/health
2. **Frontend App**: Open http://localhost:5173
3. **API Test**: Open http://localhost:3001/api/risk/zones

## 🔧 If You Get Errors:

### "Port 3001 is already in use"
```bash
# Kill the process using port 3001
netstat -ano | findstr :3001
# Note the PID and kill it:
taskkill /PID [PID_NUMBER] /F
```

### "Cannot connect to backend"
1. Make sure backend is running on port 3001
2. Check if `.env.local` file exists in root directory
3. Verify `VITE_API_BASE_URL=http://localhost:3001/api` in `.env.local`

### "API Key errors"
The app will work with demo data even without real API keys. To get real data:

1. **Google Maps API Key**:
   - Go to https://console.cloud.google.com/
   - Create project → Enable APIs → Get API key
   - Replace `GOOGLE_MAPS_API_KEY` in `backend/.env`

2. **Weather API Key**:
   - Go to https://openweathermap.org/api
   - Sign up → Get free API key
   - Replace `OPENWEATHER_API_KEY` in `backend/.env`

## 🎯 What Should Work:

✅ **Without API Keys (Demo Mode)**:
- Risk zones display
- Mock weather data
- Basic map functionality
- Dashboard statistics

✅ **With API Keys (Full Features)**:
- Real weather data
- Google Maps integration
- Live traffic data
- Geocoding services

## 📱 Expected Behavior:

1. **Backend starts**: You should see "🚀 Smart City Backend running on port 3001"
2. **Frontend starts**: Browser opens to http://localhost:5173
3. **Dashboard loads**: You see the Smart City Dashboard with risk zones
4. **Weather widget**: Shows weather data (demo or real)
5. **Interactive map**: Click on risk zones to see details

## 🆘 Still Having Issues?

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Check npm version**: `npm --version`
3. **Clear npm cache**: `npm cache clean --force`
4. **Restart terminals**: Close all terminals and start fresh
5. **Check firewall**: Make sure ports 3001 and 5173 are not blocked

## 📞 Quick Test Commands:

```bash
# Test if backend is running
curl http://localhost:3001/health

# Test API endpoint
curl http://localhost:3001/api/risk/zones

# Check if frontend can reach backend
curl http://localhost:5173
```

---

**Need help? Check the console logs in both terminals for error messages!**