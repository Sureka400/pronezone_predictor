import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock risk zones data
const mockRiskZones = [
  {
    id: 1,
    name: 'Downtown Intersection',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    risk: 'high',
    accidents: 23,
    description: 'High traffic intersection with poor visibility'
  },
  {
    id: 2,
    name: 'Highway 101 Exit',
    coordinates: { lat: 40.7505, lng: -73.9934 },
    risk: 'medium',
    accidents: 12,
    description: 'Construction zone with lane changes'
  },
  {
    id: 3,
    name: 'School District Area',
    coordinates: { lat: 40.7614, lng: -73.9776 },
    risk: 'low',
    accidents: 3,
    description: 'Residential area with speed bumps'
  }
];

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
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">
        !
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });
};

const SimpleMap = ({ 
  center = [40.7589, -73.9851], // Default to NYC
  zoom = 12,
  height = '400px',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Map Style Selector */}
      <div className="absolute top-2 right-2 z-[1000] flex gap-1">
        <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-gray-800">
          OpenStreetMap
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Risk Zone Markers */}
        {mockRiskZones.map((zone) => (
          <React.Fragment key={zone.id}>
            {/* Risk Zone Marker */}
            <Marker
              position={[zone.coordinates.lat, zone.coordinates.lng]}
              icon={createRiskIcon(zone.risk)}
            >
              <Popup maxWidth={250}>
                <div className="p-2">
                  <h3 className="font-semibold text-gray-800 mb-1">{zone.name}</h3>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                    zone.risk === 'high' ? 'bg-red-100 text-red-800' :
                    zone.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {zone.risk.toUpperCase()} RISK
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{zone.description}</p>
                  <div className="text-sm">
                    <span className="font-medium">Incidents: </span>
                    <span className="text-blue-600 font-bold">{zone.accidents}</span>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Risk Zone Circle */}
            <Circle
              center={[zone.coordinates.lat, zone.coordinates.lng]}
              radius={300}
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
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 z-[1000]">
        <h4 className="font-semibold text-gray-800 mb-1 text-xs">Risk Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Safe Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;