import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Map, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter,
  MapPin,
  AlertTriangle,
  Info
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import RiskBadge from '../components/RiskBadge'
import SidebarFilters from '../components/SidebarFilters'

const Heatmap = () => {
  const [mapStyle, setMapStyle] = useState('street')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedZone, setSelectedZone] = useState(null)
  const [filters, setFilters] = useState({})

  // Mock risk zones data
  const riskZones = [
    {
      id: 1,
      name: 'Downtown Intersection',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      risk: 'high',
      accidents: 23,
      description: 'High traffic intersection with poor visibility',
      factors: ['Heavy traffic', 'Poor lighting', 'Complex intersection'],
      lastUpdate: '2 min ago'
    },
    {
      id: 2,
      name: 'Highway 101 Exit',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      risk: 'medium',
      accidents: 12,
      description: 'Construction zone with lane changes',
      factors: ['Construction', 'Lane merging', 'Speed variations'],
      lastUpdate: '5 min ago'
    },
    {
      id: 3,
      name: 'School District Area',
      coordinates: { lat: 40.7614, lng: -73.9776 },
      risk: 'low',
      accidents: 3,
      description: 'Residential area with speed bumps',
      factors: ['School zone', 'Speed control', 'Pedestrian crossings'],
      lastUpdate: '12 min ago'
    },
    {
      id: 4,
      name: 'Shopping Mall Entrance',
      coordinates: { lat: 40.7282, lng: -73.9942 },
      risk: 'high',
      accidents: 18,
      description: 'Busy commercial area with parking conflicts',
      factors: ['Heavy pedestrian traffic', 'Parking maneuvers', 'Multiple entrances'],
      lastUpdate: '1 min ago'
    },
    {
      id: 5,
      name: 'Bridge Approach',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      risk: 'medium',
      accidents: 8,
      description: 'Bridge entrance with weather exposure',
      factors: ['Weather exposure', 'Elevation change', 'Wind effects'],
      lastUpdate: '8 min ago'
    }
  ]

  const mapStyles = [
    { id: 'street', name: 'Street', icon: Map },
    { id: 'satellite', name: 'Satellite', icon: Layers },
    { id: 'dark', name: 'Dark', icon: MapPin }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen pt-16 pb-8">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Interactive <span className="gradient-text">Risk Heatmap</span>
              </h1>
              <p className="text-white/70">
                Real-time visualization of accident-prone zones across the city
              </p>
            </div>
            
            {/* Map Controls */}
            <div className="flex items-center gap-3">
              <div className="flex bg-white/10 rounded-lg p-1">
                {mapStyles.map((style) => {
                  const Icon = style.icon
                  return (
                    <motion.button
                      key={style.id}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                        mapStyle === style.id
                          ? 'bg-accent-cyan text-primary-dark'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setMapStyle(style.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={16} />
                      {style.name}
                    </motion.button>
                  )
                })}
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  className="p-2 glass-card hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ZoomIn size={20} />
                </motion.button>
                <motion.button
                  className="p-2 glass-card hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ZoomOut size={20} />
                </motion.button>
                <motion.button
                  className="p-2 glass-card hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Map Container */}
        <motion.div variants={itemVariants} className="relative">
          <GlassCard className="p-6 h-[600px] relative overflow-hidden">
            {/* Map Background */}
            <div className={`absolute inset-6 rounded-lg overflow-hidden ${
              mapStyle === 'dark' ? 'bg-gray-900' : 
              mapStyle === 'satellite' ? 'bg-green-900' : 'bg-blue-100'
            }`}>
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="city-grid-bg h-full"></div>
              </div>

              {/* Risk Zones */}
              {riskZones.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  className={`absolute w-16 h-16 rounded-full cursor-pointer ${
                    zone.risk === 'high' ? 'bg-risk-high/40' :
                    zone.risk === 'medium' ? 'bg-risk-medium/40' : 'bg-risk-low/40'
                  }`}
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

              {/* Heat Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-risk-high/10 via-transparent to-risk-medium/10 pointer-events-none"></div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-6 left-6 glass-card p-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <Info size={16} />
                Risk Levels
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-risk-high rounded-full"></div>
                  <span className="text-white/80 text-sm">High Risk (70-100%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-risk-medium rounded-full"></div>
                  <span className="text-white/80 text-sm">Medium Risk (40-69%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-risk-low rounded-full"></div>
                  <span className="text-white/80 text-sm">Safe Zone (0-39%)</span>
                </div>
              </div>
            </div>

            {/* Zone Info Panel */}
            {selectedZone && (
              <motion.div
                className="absolute top-6 right-6 w-80 glass-card p-4"
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
                </div>
                
                <p className="text-white/70 text-sm mb-3">{selectedZone.description}</p>
                
                <div className="mb-3">
                  <div className="text-white/90 font-medium text-sm mb-1">Accidents This Month</div>
                  <div className="text-2xl font-bold text-accent-cyan">{selectedZone.accidents}</div>
                </div>
                
                <div className="mb-3">
                  <div className="text-white/90 font-medium text-sm mb-2">Risk Factors</div>
                  <div className="space-y-1">
                    {selectedZone.factors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-white/70">
                        <div className="w-1 h-1 bg-accent-cyan rounded-full"></div>
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-white/50">
                  Last updated: {selectedZone.lastUpdate}
                </div>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-risk-high mb-1">
              {riskZones.filter(z => z.risk === 'high').length}
            </div>
            <div className="text-white/70 text-sm">High Risk Zones</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-risk-medium mb-1">
              {riskZones.filter(z => z.risk === 'medium').length}
            </div>
            <div className="text-white/70 text-sm">Medium Risk Zones</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-risk-low mb-1">
              {riskZones.filter(z => z.risk === 'low').length}
            </div>
            <div className="text-white/70 text-sm">Safe Zones</div>
          </GlassCard>
          
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-cyan mb-1">
              {riskZones.reduce((sum, zone) => sum + zone.accidents, 0)}
            </div>
            <div className="text-white/70 text-sm">Total Incidents</div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Sidebar Filters */}
      <SidebarFilters
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  )
}

export default Heatmap