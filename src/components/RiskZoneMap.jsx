import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { useRiskZones } from '../hooks/useRiskZones';
import GlassCard from './GlassCard';
import RiskBadge from './RiskBadge';

const RiskZoneMap = ({ lat, lng, radius = 5000, className = '' }) => {
  const { zones, summary, loading, error } = useRiskZones(lat, lng, radius);
  const [selectedZone, setSelectedZone] = useState(null);

  const getRiskColor = (risk) => {
    const colors = {
      'high': 'bg-risk-high/40 border-risk-high',
      'medium': 'bg-risk-medium/40 border-risk-medium',
      'low': 'bg-risk-low/40 border-risk-low'
    };
    return colors[risk] || colors.medium;
  };

  if (loading) {
    return (
      <GlassCard className={`p-6 h-96 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white/70">
            <RefreshCw className="mx-auto mb-2 animate-spin" size={24} />
            <p>Loading risk zones...</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className={`p-6 h-96 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white/70">
            <AlertTriangle className="mx-auto mb-2" size={24} />
            <p>Failed to load risk zones</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={`p-6 h-96 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-accent-cyan">Live Risk Zones</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-accent-cyan text-primary-dark rounded-lg text-sm font-medium">
            Live
          </button>
          <button className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-sm">
            Satellite
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-full bg-primary-secondary rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 via-transparent to-risk-high/20"></div>
        
        {/* Risk Zones */}
        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            className={`absolute w-16 h-16 rounded-full cursor-pointer ${getRiskColor(zone.risk)}`}
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${25 + (index * 10)}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setSelectedZone(zone)}
          >
            <div className={`w-full h-full rounded-full border-2 ${
              zone.risk === 'high' ? 'border-risk-high animate-pulse' :
              zone.risk === 'medium' ? 'border-risk-medium' : 'border-risk-low'
            } flex items-center justify-center`}>
              <AlertTriangle 
                size={20} 
                className={
                  zone.risk === 'high' ? 'text-risk-high' :
                  zone.risk === 'medium' ? 'text-risk-medium' : 'text-risk-low'
                } 
              />
            </div>
          </motion.div>
        ))}

        {/* Center indicator if coordinates provided */}
        {lat && lng && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-accent-cyan rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Zone Info Panel */}
        {selectedZone && (
          <motion.div
            className="absolute top-4 right-4 w-80 glass-card p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white">{selectedZone.name}</h3>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-white/50 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="mb-3">
              <RiskBadge level={selectedZone.risk} />
              <div className="text-sm text-white/70 mt-1">
                Risk Score: {selectedZone.riskScore}/100
              </div>
            </div>
            
            <p className="text-white/70 text-sm mb-3">{selectedZone.description}</p>
            
            <div className="mb-3">
              <div className="text-white/90 font-medium text-sm mb-1">Incidents This Month</div>
              <div className="text-2xl font-bold text-accent-cyan">{selectedZone.accidents}</div>
            </div>
            
            {selectedZone.recommendations && (
              <div className="mb-3">
                <div className="text-white/90 font-medium text-sm mb-2">Recommendations</div>
                <div className="space-y-1">
                  {selectedZone.recommendations.slice(0, 2).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-white/70">
                      <div className="w-1 h-1 bg-accent-cyan rounded-full mt-1.5 flex-shrink-0"></div>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-xs text-white/50">
              Last updated: {new Date(selectedZone.lastUpdate).toLocaleTimeString()}
            </div>
          </motion.div>
        )}

        {/* Default message if no zones */}
        {zones.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/50">
              <MapPin size={48} className="mx-auto mb-2" />
              <p>No risk zones in this area</p>
              <p className="text-sm">Try expanding the search radius</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-risk-high rounded-full"></div>
          <span className="text-sm text-white/70">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-risk-medium rounded-full"></div>
          <span className="text-sm text-white/70">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-risk-low rounded-full"></div>
          <span className="text-sm text-white/70">Safe Zone</span>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-risk-high">{summary.highRisk}</div>
            <div className="text-xs text-white/70">High</div>
          </div>
          <div>
            <div className="text-lg font-bold text-risk-medium">{summary.mediumRisk}</div>
            <div className="text-xs text-white/70">Medium</div>
          </div>
          <div>
            <div className="text-lg font-bold text-risk-low">{summary.lowRisk}</div>
            <div className="text-xs text-white/70">Safe</div>
          </div>
          <div>
            <div className="text-lg font-bold text-accent-cyan">{Math.round(summary.averageRiskScore)}</div>
            <div className="text-xs text-white/70">Avg Score</div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default RiskZoneMap;