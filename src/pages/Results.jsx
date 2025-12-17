import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Shield,
  Clock,
  MapPin,
  Users,
  Download,
  Share2
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import RiskBadge from '../components/RiskBadge'
import AnimatedButton from '../components/AnimatedButton'

const Results = () => {
  const [selectedResult, setSelectedResult] = useState(null)
  const [animatedValues, setAnimatedValues] = useState({
    riskScore: 0,
    confidence: 0,
    impactReduction: 0
  })

  // Mock prediction results
  const predictionResults = [
    {
      id: 1,
      location: 'Downtown Financial District',
      riskLevel: 'high',
      riskScore: 78,
      confidence: 92,
      predictedAccidents: 15,
      currentAccidents: 23,
      impactReduction: 35,
      timeframe: 'Next 7 days',
      factors: [
        'Heavy morning traffic (8-10 AM)',
        'Construction on Main Street',
        'Rainy weather forecast',
        'Limited visibility at intersections'
      ],
      recommendations: [
        'Deploy additional traffic officers during peak hours',
        'Install temporary traffic lights at construction zones',
        'Increase street lighting at key intersections',
        'Implement dynamic speed limit signs'
      ],
      timestamp: '2024-01-15 14:30:00'
    },
    {
      id: 2,
      location: 'Highway 101 Corridor',
      riskLevel: 'medium',
      riskScore: 54,
      confidence: 87,
      predictedAccidents: 8,
      currentAccidents: 12,
      impactReduction: 25,
      timeframe: 'Next 14 days',
      factors: [
        'Moderate traffic density',
        'Weather conditions stable',
        'Ongoing road maintenance',
        'School zone proximity'
      ],
      recommendations: [
        'Monitor construction progress closely',
        'Enhance school zone signage',
        'Regular patrol during school hours',
        'Weather-responsive traffic management'
      ],
      timestamp: '2024-01-15 13:45:00'
    },
    {
      id: 3,
      location: 'Residential Park Avenue',
      riskLevel: 'low',
      riskScore: 28,
      confidence: 94,
      predictedAccidents: 2,
      currentAccidents: 3,
      impactReduction: 15,
      timeframe: 'Next 30 days',
      factors: [
        'Low traffic volume',
        'Good weather conditions',
        'Well-maintained roads',
        'Effective speed control measures'
      ],
      recommendations: [
        'Maintain current safety measures',
        'Regular road condition monitoring',
        'Community awareness programs',
        'Pedestrian safety initiatives'
      ],
      timestamp: '2024-01-15 12:20:00'
    }
  ]

  useEffect(() => {
    if (selectedResult) {
      // Animate values when a result is selected
      const animateValue = (start, end, duration, callback) => {
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const current = start + (end - start) * progress
          callback(Math.round(current))
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }
        animate()
      }

      animateValue(0, selectedResult.riskScore, 1500, (value) => 
        setAnimatedValues(prev => ({ ...prev, riskScore: value }))
      )
      animateValue(0, selectedResult.confidence, 1800, (value) => 
        setAnimatedValues(prev => ({ ...prev, confidence: value }))
      )
      animateValue(0, selectedResult.impactReduction, 2000, (value) => 
        setAnimatedValues(prev => ({ ...prev, impactReduction: value }))
      )
    }
  }, [selectedResult])

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

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high': return AlertTriangle
      case 'medium': return AlertCircle
      case 'low': return CheckCircle
      default: return AlertCircle
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-risk-high'
      case 'medium': return 'text-risk-medium'
      case 'low': return 'text-risk-low'
      default: return 'text-accent-cyan'
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
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Prediction <span className="gradient-text">Results</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl">
            AI-generated risk assessments and safety recommendations for your city's high-risk zones
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Results List */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="text-accent-cyan" size={20} />
                Recent Predictions
              </h2>
              
              <div className="space-y-4">
                {predictionResults.map((result) => {
                  const RiskIcon = getRiskIcon(result.riskLevel)
                  return (
                    <motion.div
                      key={result.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedResult?.id === result.id
                          ? 'bg-accent-cyan/10 border-accent-cyan/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedResult(result)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-white text-sm">{result.location}</h3>
                        <RiskIcon className={getRiskColor(result.riskLevel)} size={16} />
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <RiskBadge level={result.riskLevel} size="sm" />
                        <span className="text-accent-cyan font-bold">{result.riskScore}%</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {result.timeframe}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingDown size={12} className="text-risk-low" />
                          -{result.impactReduction}%
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Detailed Results */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            {selectedResult ? (
              <div className="space-y-6">
                {/* Risk Assessment Card */}
                <GlassCard className="p-8 glow-border">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedResult.location}</h2>
                      <div className="flex items-center gap-2 text-white/70">
                        <MapPin size={16} />
                        <span>Risk Assessment • {selectedResult.timeframe}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AnimatedButton variant="secondary" size="sm">
                        <Share2 size={16} />
                      </AnimatedButton>
                      <AnimatedButton variant="secondary" size="sm">
                        <Download size={16} />
                      </AnimatedButton>
                    </div>
                  </div>

                  {/* Risk Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-3">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="6"
                            fill="none"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="35"
                            stroke={
                              selectedResult.riskLevel === 'high' ? '#ff4c4c' :
                              selectedResult.riskLevel === 'medium' ? '#ffb020' : '#2ed573'
                            }
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: animatedValues.riskScore / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{
                              pathLength: animatedValues.riskScore / 100,
                              strokeDasharray: "219.8",
                              strokeDashoffset: `${219.8 * (1 - animatedValues.riskScore / 100)}`
                            }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">{animatedValues.riskScore}%</span>
                        </div>
                      </div>
                      <div className="text-white/70 text-sm">Risk Score</div>
                      <RiskBadge level={selectedResult.riskLevel} size="sm" className="mt-2" />
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-cyan mb-2">
                        {animatedValues.confidence}%
                      </div>
                      <div className="text-white/70 text-sm mb-2">AI Confidence</div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          className="bg-accent-cyan h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${animatedValues.confidence}%` }}
                          transition={{ duration: 1.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-risk-low mb-2">
                        -{animatedValues.impactReduction}%
                      </div>
                      <div className="text-white/70 text-sm mb-2">Impact Reduction</div>
                      <div className="flex items-center justify-center gap-1 text-xs text-risk-low">
                        <TrendingDown size={12} />
                        <span>Potential Improvement</span>
                      </div>
                    </div>
                  </div>

                  {/* Accident Prediction */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedResult.predictedAccidents}
                      </div>
                      <div className="text-white/70 text-sm">Predicted Accidents</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedResult.currentAccidents}
                      </div>
                      <div className="text-white/70 text-sm">Current Monthly Average</div>
                    </div>
                  </div>
                </GlassCard>

                {/* Risk Factors */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-accent-cyan" size={20} />
                    Risk Factors Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedResult.factors.map((factor, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-2 h-2 bg-accent-cyan rounded-full flex-shrink-0"></div>
                        <span className="text-white/80 text-sm">{factor}</span>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Recommendations */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="text-accent-cyan" size={20} />
                    Safety Recommendations
                  </h3>
                  <div className="space-y-3">
                    {selectedResult.recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <CheckCircle className="text-accent-cyan flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-white/90 text-sm">{recommendation}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            ) : (
              <GlassCard className="p-12 h-full flex items-center justify-center">
                <div className="text-center text-white/50">
                  <Users size={64} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a Prediction</h3>
                  <p>Choose a prediction result from the list to view detailed analysis</p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Results