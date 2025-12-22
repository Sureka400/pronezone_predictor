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
import SimpleMap from '../components/SimpleMap'

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
          <GlassCard className="p-6">
            {/* Real Interactive Map */}
            <div className="h-[500px] rounded-lg overflow-hidden">
              <SimpleMap 
                height="500px" 
                zoom={12}
                center={[40.7589, -73.9851]} // NYC coordinates
              />
            </div>
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