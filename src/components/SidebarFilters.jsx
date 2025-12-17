import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import GlassCard from './GlassCard'

const SidebarFilters = ({ isOpen, onToggle, filters, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({
    trafficDensity: true,
    weatherSeverity: 50,
    timeOfDay: 'morning',
    vehicleTypes: {
      bike: true,
      car: true,
      truck: false
    }
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const timeOptions = [
    { id: 'morning', label: 'Morning', icon: '🌅' },
    { id: 'evening', label: 'Evening', icon: '🌆' },
    { id: 'night', label: 'Night', icon: '🌙' }
  ]

  const vehicleOptions = [
    { id: 'bike', label: 'Bike', icon: '🚲' },
    { id: 'car', label: 'Car', icon: '🚗' },
    { id: 'truck', label: 'Heavy Vehicle', icon: '🚛' }
  ]

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 glass-card p-3 hover:bg-white/20 transition-colors"
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-16 bottom-0 w-80 z-30 overflow-y-auto"
          >
            <GlassCard className="h-full m-4 p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <Filter className="text-accent-cyan" size={24} />
                <h3 className="text-xl font-bold text-accent-cyan">Filters</h3>
              </div>

              {/* Traffic Density */}
              <div className="mb-6">
                <h4 className="text-white/90 font-medium mb-3">Traffic Density</h4>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Enable</span>
                  <motion.button
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      activeFilters.trafficDensity ? 'bg-accent-cyan' : 'bg-white/20'
                    }`}
                    onClick={() => handleFilterChange('trafficDensity', !activeFilters.trafficDensity)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                      animate={{ x: activeFilters.trafficDensity ? 24 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Weather Severity */}
              <div className="mb-6">
                <h4 className="text-white/90 font-medium mb-3">Weather Severity</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Impact Level</span>
                    <span className="text-accent-cyan font-medium">{activeFilters.weatherSeverity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFilters.weatherSeverity}
                    onChange={(e) => handleFilterChange('weatherSeverity', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Time of Day */}
              <div className="mb-6">
                <h4 className="text-white/90 font-medium mb-3">Time of Day</h4>
                <div className="grid grid-cols-3 gap-2">
                  {timeOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        activeFilters.timeOfDay === option.id
                          ? 'bg-accent-cyan text-primary-dark'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                      onClick={() => handleFilterChange('timeOfDay', option.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Vehicle Types */}
              <div className="mb-6">
                <h4 className="text-white/90 font-medium mb-3">Vehicle Types</h4>
                <div className="space-y-3">
                  {vehicleOptions.map((vehicle) => (
                    <motion.div
                      key={vehicle.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => handleFilterChange('vehicleTypes', {
                        ...activeFilters.vehicleTypes,
                        [vehicle.id]: !activeFilters.vehicleTypes[vehicle.id]
                      })}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{vehicle.icon}</span>
                        <span className="text-white/80">{vehicle.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={activeFilters.vehicleTypes[vehicle.id]}
                        onChange={() => {}}
                        className="w-4 h-4 accent-accent-cyan"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <motion.button
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-lg transition-colors font-medium"
                onClick={() => {
                  const resetFilters = {
                    trafficDensity: true,
                    weatherSeverity: 50,
                    timeOfDay: 'morning',
                    vehicleTypes: { bike: true, car: true, truck: false }
                  }
                  setActiveFilters(resetFilters)
                  onFilterChange?.(resetFilters)
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset Filters
              </motion.button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00d4ff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00d4ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
      `}</style>
    </>
  )
}

export default SidebarFilters