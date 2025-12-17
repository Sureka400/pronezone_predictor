import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Cloud, 
  Eye, 
  Droplets, 
  Wind, 
  Clock,
  Car,
  Bike,
  Truck,
  Play,
  RotateCcw
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'
import RiskBadge from '../components/RiskBadge'

const Predictions = () => {
  const [predictionParams, setPredictionParams] = useState({
    dateRange: 7,
    rain: 30,
    fog: 20,
    visibility: 80,
    peakHour: 'morning',
    vehicleTypes: {
      bike: true,
      car: true,
      truck: false
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [predictionResult, setPredictionResult] = useState({
    riskLevel: 'high',
    riskScore: 78,
    confidence: 92,
    factors: [
      'Heavy traffic during peak hours',
      'Poor weather conditions expected',
      'Historical accident patterns',
      'Construction zone nearby'
    ],
    recommendations: [
      'Increase traffic patrol presence',
      'Deploy weather warning systems',
      'Implement temporary speed limits',
      'Enhance road lighting'
    ]
  })

  const handleParamChange = (key, value) => {
    setPredictionParams(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleVehicleTypeChange = (type) => {
    setPredictionParams(prev => ({
      ...prev,
      vehicleTypes: {
        ...prev.vehicleTypes,
        [type]: !prev.vehicleTypes[type]
      }
    }))
  }

  const runPrediction = async () => {
    setIsLoading(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate dynamic results based on parameters
    const riskScore = Math.max(20, Math.min(95, 
      predictionParams.rain * 0.5 + 
      (100 - predictionParams.visibility) * 0.3 + 
      predictionParams.fog * 0.4 + 
      Math.random() * 20
    ))
    
    const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low'
    
    setPredictionResult(prev => ({
      ...prev,
      riskScore: Math.round(riskScore),
      riskLevel,
      confidence: Math.round(85 + Math.random() * 10)
    }))
    
    setIsLoading(false)
    setShowResults(true)
  }

  const resetParams = () => {
    setPredictionParams({
      dateRange: 7,
      rain: 30,
      fog: 20,
      visibility: 80,
      peakHour: 'morning',
      vehicleTypes: {
        bike: true,
        car: true,
        truck: false
      }
    })
    setShowResults(false)
  }

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

  const peakHourOptions = [
    { id: 'morning', label: 'Morning', icon: '🌅', time: '7-9 AM' },
    { id: 'evening', label: 'Evening', icon: '🌆', time: '5-7 PM' },
    { id: 'night', label: 'Night', icon: '🌙', time: '10 PM-2 AM' }
  ]

  const vehicleOptions = [
    { id: 'bike', label: 'Bike', icon: Bike, color: 'text-accent-teal' },
    { id: 'car', label: 'Car', icon: Car, color: 'text-accent-cyan' },
    { id: 'truck', label: 'Heavy Vehicle', icon: Truck, color: 'text-accent-purple' }
  ]

  return (
    <div className="min-h-screen pt-16 pb-8">
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Risk <span className="gradient-text">Prediction</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Configure parameters and let our AI analyze potential accident risks 
            for your specified conditions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Panel */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-8 glow-border">
              <h2 className="text-2xl font-bold text-accent-cyan mb-6 flex items-center gap-3">
                <Play className="text-accent-cyan" size={24} />
                Prediction Parameters
              </h2>

              {/* Date Range */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-white/90 font-medium mb-3">
                  <Calendar size={18} />
                  Prediction Period
                </label>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Days ahead</span>
                    <span className="text-accent-cyan font-medium">{predictionParams.dateRange} days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={predictionParams.dateRange}
                    onChange={(e) => handleParamChange('dateRange', parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Weather Conditions */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-white/90 font-medium mb-4">
                  <Cloud size={18} />
                  Weather Conditions
                </label>
                
                <div className="space-y-4">
                  {/* Rain */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets size={16} className="text-accent-cyan" />
                        <span className="text-white/80">Rain Intensity</span>
                      </div>
                      <span className="text-accent-cyan font-medium">{predictionParams.rain}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={predictionParams.rain}
                      onChange={(e) => handleParamChange('rain', parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Fog */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind size={16} className="text-accent-purple" />
                        <span className="text-white/80">Fog Density</span>
                      </div>
                      <span className="text-accent-purple font-medium">{predictionParams.fog}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={predictionParams.fog}
                      onChange={(e) => handleParamChange('fog', parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Visibility */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye size={16} className="text-accent-teal" />
                        <span className="text-white/80">Visibility</span>
                      </div>
                      <span className="text-accent-teal font-medium">{predictionParams.visibility}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={predictionParams.visibility}
                      onChange={(e) => handleParamChange('visibility', parseInt(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              {/* Peak Hour Selection */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-white/90 font-medium mb-3">
                  <Clock size={18} />
                  Peak Hour Analysis
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {peakHourOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        predictionParams.peakHour === option.id
                          ? 'bg-accent-cyan text-primary-dark'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                      onClick={() => handleParamChange('peakHour', option.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg mb-1">{option.icon}</div>
                      <div>{option.label}</div>
                      <div className="text-xs opacity-70">{option.time}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Vehicle Types */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-white/90 font-medium mb-3">
                  <Car size={18} />
                  Vehicle Types
                </label>
                <div className="space-y-3">
                  {vehicleOptions.map((vehicle) => {
                    const Icon = vehicle.icon
                    return (
                      <motion.div
                        key={vehicle.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => handleVehicleTypeChange(vehicle.id)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={vehicle.color} size={20} />
                          <span className="text-white/80">{vehicle.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={predictionParams.vehicleTypes[vehicle.id]}
                          onChange={() => {}}
                          className="w-4 h-4 accent-accent-cyan"
                        />
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <AnimatedButton
                  onClick={runPrediction}
                  loading={isLoading}
                  disabled={isLoading}
                  className="flex-1"
                  size="lg"
                >
                  {isLoading ? 'Analyzing...' : 'Predict Risk Level'}
                </AnimatedButton>

                <AnimatedButton
                  variant="secondary"
                  onClick={resetParams}
                  className="px-4"
                >
                  <RotateCcw size={20} />
                </AnimatedButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Results Panel */}
          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {showResults ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard className="p-8 glow-border">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                      Prediction Results
                    </h2>

                    {/* Risk Score Circle */}
                    <div className="flex justify-center mb-8">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="none"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={
                              predictionResult.riskLevel === 'high' ? '#ff4c4c' :
                              predictionResult.riskLevel === 'medium' ? '#ffb020' : '#2ed573'
                            }
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: predictionResult.riskScore / 100 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            style={{
                              pathLength: predictionResult.riskScore / 100,
                              strokeDasharray: "251.2",
                              strokeDashoffset: `${251.2 * (1 - predictionResult.riskScore / 100)}`
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-4xl font-bold text-white mb-1">
                            {predictionResult.riskScore}%
                          </div>
                          <RiskBadge level={predictionResult.riskLevel} />
                        </div>
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="text-center mb-6">
                      <div className="text-white/70 text-sm mb-1">AI Confidence</div>
                      <div className="text-2xl font-bold text-accent-cyan">
                        {predictionResult.confidence}%
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Risk Factors</h3>
                      <div className="space-y-2">
                        {predictionResult.factors.map((factor, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-white/5 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                            <span className="text-white/80 text-sm">{factor}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                      <div className="space-y-2">
                        {predictionResult.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center gap-3 p-2 bg-accent-cyan/10 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-accent-cyan rounded-full"></div>
                            <span className="text-white/80 text-sm">{rec}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <GlassCard className="p-8 h-full flex items-center justify-center">
                    <div className="text-center text-white/50">
                      <Play size={64} className="mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Predict</h3>
                      <p>Configure your parameters and run the AI analysis</p>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

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
    </div>
  )
}

export default Predictions