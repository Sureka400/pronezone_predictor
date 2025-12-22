import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, MapPin, Navigation } from 'lucide-react';
import { useRiskZones } from '../hooks/useRiskZones';
import RiskBadge from './RiskBadge';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom risk zone icons
const createRiskIcon = (risk) => {
  const colors = {
    high: '#ff4c4c',
    medium: '#ffb020', 
    low: '#2ed573'
  };
  
  return L.divIcon({
    className: 'custom-risk-marker',
    html: `
      <div style="
        background: ${colors[risk]};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        !
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const LeafletMap = ({ 
  center = [40.7589, -73.9851], // Default to NYC
  zoom = 12,
  height = '400px',
  showRiskZones = true,
  className = ''
}) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const { zones, loading, error } = useRiskZones();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  const mapStyles = {
    openStreetMap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    cartoDB: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    cartoDBDark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const [currentStyle, setCurrentStyle] = useState('openStreetMap');

  return (
    <div className={`relative ${className}`}>
      {/* Map Style Selector */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        <button
          onClick={() => setCurrentStyle('openStreetMap')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            currentStyle === 'openStreetMap' 
              ? 'bg-accent-cyan text-primary-dark' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Street
        </button>
        <button
          onClick={() => setCurrentStyle('satellite')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            currentStyle === 'satellite' 
              ? 'bg-accent-cyan text-primary-dark' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => setCurrentStyle('cartoDBDark')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            currentStyle === 'cartoDBDark' 
              ? 'bg-accent-cyan text-primary-dark' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Dark
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1000] rounded-lg">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan mx-auto mb-2"></div>
            <p>Loading map data...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <MapContainer
        center={userLocation || center}
        zoom={zoom}
        style={{ height, width: '100%', borderRadius: '8px' }}
        whenCreated={setMap}
      >
        <TileLayer
          url={mapStyles[currentStyle]}
          attribution={
            currentStyle === 'openStreetMap' 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              : currentStyle === 'satellite'
              ? '&copy; <a href="https://www.esri.com/">Esri</a>'
              : '&copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <Navigation className="mx-auto mb-1" size={16} />
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Risk Zone Markers */}
        {showRiskZones && zones.map((zone) => (
          <React.Fragment key={zone.id}>
            {/* Risk Zone Marker */}
            <Marker
              position={[zone.coordinates.lat, zone.coordinates.lng]}
              icon={createRiskIcon(zone.risk)}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{zone.name}</h3>
                    <RiskBadge level={zone.risk} size="sm" />
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{zone.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Risk Score:</span>
                      <div className="text-lg font-bold text-red-600">{zone.riskScore}/100</div>
                    </div>
                    <div>
                      <span className="font-medium">Incidents:</span>
                      <div className="text-lg font-bold text-blue-600">{zone.accidents}</div>
                    </div>
                  </div>

                  {zone.factors && (
                    <div className="mt-2">
                      <span className="font-medium text-sm">Key Factors:</span>
                      <div className="text-xs text-gray-600 mt-1">
                        Traffic: {zone.factors.traffic?.level} | 
                        Weather Impact: {zone.factors.weather?.impact}%
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    Updated: {new Date(zone.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Risk Zone Circle */}
            <Circle
              center={[zone.coordinates.lat, zone.coordinates.lng]}
              radius={200} // 200 meter radius
              pathOptions={{
                color: zone.risk === 'high' ? '#ff4c4c' : zone.risk === 'medium' ? '#ffb020' : '#2ed573',
                fillColor: zone.risk === 'high' ? '#ff4c4c' : zone.risk === 'medium' ? '#ffb020' : '#2ed573',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 z-[1000]">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Risk Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Risk (70-100)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk (40-69)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Zone (0-39)</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500/90 text-white p-4 rounded-lg z-[1000]">
          <AlertTriangle className="mx-auto mb-2" size={24} />
          <p className="text-center">Failed to load risk data</p>
          <p className="text-center text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;