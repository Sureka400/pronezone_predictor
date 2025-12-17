# AI Accident-Prone Zone Predictor - Smart City Dashboard

A premium, futuristic React-based dashboard for predicting and visualizing accident-prone zones in smart cities using AI, real-time traffic data, and weather analytics.

## 🚀 Features

### **Premium Design**
- **Apple-level aesthetics** with glassmorphism and neumorphism
- **Futuristic color palette** - Neon cyan, electric purple, soft teal
- **Dynamic risk-based colors** - Red (high), Amber (medium), Green (safe)
- **Smooth animations** and micro-interactions throughout

### **Core Functionality**
- **Landing Page** - Animated hero with floating info cards and statistics
- **Dashboard** - Real-time metrics, interactive map, and recent alerts
- **Predictions** - AI risk analysis with configurable parameters
- **Heatmap** - Interactive risk visualization with zone details
- **Results** - Detailed prediction results and recommendations
- **Insights** - Comprehensive analytics with charts and trends

### **Interactive Components**
- **Glass Navigation** with blur effects and active states
- **Animated Buttons** with ripple effects and loading states
- **Risk Badges** with dynamic colors and icons
- **Sidebar Filters** with toggles, sliders, and selections
- **Chart Visualizations** using Chart.js with custom styling

## 🛠 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom glassmorphism utilities
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Chart.js with React Chart.js 2
- **Maps**: Leaflet.js integration ready
- **Icons**: Lucide React (outlined style)
- **Fonts**: Inter (with SF-Pro fallback)
- **State**: React Hooks (no backend required)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### **Color Palette**
```css
Primary: #0a0e1a (Midnight Blue)
Secondary: #1a1f2e (Charcoal Black)
Accent Cyan: #00d4ff
Accent Purple: #8b5cf6
Accent Teal: #14b8a6
Risk High: #ff4c4c
Risk Medium: #ffb020
Risk Low: #2ed573
```

### **Components Structure**
```
src/
├── components/
│   ├── Navbar.jsx           # Glass navigation with profile
│   ├── GlassCard.jsx        # Reusable glass morphism card
│   ├── RiskBadge.jsx        # Dynamic risk level indicators
│   ├── AnimatedButton.jsx   # Interactive buttons with ripples
│   └── SidebarFilters.jsx   # Collapsible filter panel
├── pages/
│   ├── Landing.jsx          # Hero experience with animations
│   ├── Dashboard.jsx        # Main control center
│   ├── Heatmap.jsx          # Interactive risk map
│   ├── Predictions.jsx      # AI prediction interface
│   ├── Results.jsx          # Detailed prediction results
│   └── Insights.jsx         # Analytics and charts
└── utils/
    └── cn.js               # Tailwind class merging utility
```

## 🎯 Key Features

### **Landing Page**
- Animated city grid background with floating particles
- Real-time counter animations for statistics
- Floating glass info cards with risk detection status
- Smooth scroll indicators and call-to-action buttons

### **Dashboard**
- Live updating metrics with trend indicators
- Interactive risk heatmap placeholder (Leaflet.js ready)
- Recent alerts feed with risk badges
- Quick action buttons for common tasks

### **Predictions Panel**
- Configurable AI parameters (weather, traffic, time)
- Real-time slider controls with visual feedback
- Animated risk score visualization
- Detailed factor analysis and recommendations

### **Interactive Heatmap**
- Multiple map style options (Street, Satellite, Dark)
- Clickable risk zones with detailed popups
- Real-time zone information and statistics
- Animated risk indicators with pulse effects

### **Results Analysis**
- Animated circular progress indicators
- Detailed risk factor breakdowns
- Safety recommendations with priority levels
- Exportable reports and sharing options

### **Analytics Dashboard**
- Interactive Chart.js visualizations
- Time-based trend analysis
- Risk distribution insights
- Key metrics with animated counters

## 🎨 Animation System

### **Framer Motion Animations**
- **Page transitions** with stagger effects
- **Hover animations** on interactive elements
- **Loading states** with skeleton placeholders
- **Chart draw-in** effects for data visualization
- **Ripple effects** on button interactions

### **Custom CSS Animations**
- **Floating particles** background animation
- **Grid movement** for city-like feel
- **Neon pulse** effects for critical alerts
- **Gradient animations** for dynamic backgrounds

## 🔧 Customization

### **Adding New Risk Zones**
```javascript
const newZone = {
  id: 6,
  name: 'New Risk Area',
  coordinates: { lat: 40.7500, lng: -73.9900 },
  risk: 'medium',
  accidents: 10,
  description: 'Description of the risk area',
  factors: ['Factor 1', 'Factor 2'],
  lastUpdate: 'Just now'
}
```

### **Modifying Color Themes**
Update `tailwind.config.js` to customize the color palette:
```javascript
colors: {
  accent: {
    cyan: '#your-color',
    purple: '#your-color',
    teal: '#your-color',
  },
  risk: {
    high: '#your-color',
    medium: '#your-color',
    low: '#your-color',
  }
}
```

## 📱 Responsive Design

- **Desktop-first** approach with mobile adaptations
- **Collapsible sidebar** for tablet and mobile
- **Stacked card layouts** on smaller screens
- **Touch-friendly** interactions and button sizes

## 🚀 Performance

- **Lazy loading** for chart components
- **Optimized animations** with hardware acceleration
- **Efficient re-renders** with React.memo where needed
- **Debounced interactions** for smooth performance

## 🔮 Future Enhancements

- **Real Leaflet.js integration** for interactive maps
- **WebSocket connections** for real-time data
- **PWA capabilities** for offline functionality
- **Advanced AI model integration** for predictions
- **Multi-language support** for international use

## 📄 License

MIT License - Feel free to use this project for your smart city initiatives.

---

**Built with ❤️ for safer, smarter cities**