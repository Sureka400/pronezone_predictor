import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, TrendingUp, Shield, Zap } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'

const Landing = () => {
  const [counters, setCounters] = useState({
    accidents: 0,
    accuracy: 0,
    cities: 0
  })

  const targetValues = {
    accidents: 2847,
    accuracy: 94,
    cities: 15
  }

  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000
      const steps = 60
      const increment = {
        accidents: targetValues.accidents / steps,
        accuracy: targetValues.accuracy / steps,
        cities: targetValues.cities / steps
      }

      let step = 0
      const timer = setInterval(() => {
        step++
        setCounters({
          accidents: Math.min(Math.floor(increment.accidents * step), targetValues.accidents),
          accuracy: Math.min(Math.floor(increment.accuracy * step), targetValues.accuracy),
          cities: Math.min(Math.floor(increment.cities * step), targetValues.cities)
        })

        if (step >= steps) {
          clearInterval(timer)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }

    const timer = setTimeout(animateCounters, 500)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 city-grid-bg opacity-30"></div>
      <div className="absolute inset-0 floating-particles"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/80 via-transparent to-primary-secondary/80"></div>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Title */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">AI-Powered</span>
              <br />
              <span className="text-white">Accident Prevention</span>
              <br />
              <span className="neon-text">For Smart Cities</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Predict high-risk accident zones using advanced AI, real-time traffic data, 
              and weather analytics to make your city safer.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <GlassCard className="p-6 text-center glow-border">
              <div className="text-4xl font-bold text-accent-cyan mb-2">
                {counters.accidents.toLocaleString()}
              </div>
              <div className="text-white/70">Accidents Prevented</div>
              <TrendingUp className="mx-auto mt-3 text-accent-cyan" size={24} />
            </GlassCard>

            <GlassCard className="p-6 text-center glow-border">
              <div className="text-4xl font-bold text-accent-cyan mb-2">
                {counters.accuracy}%
              </div>
              <div className="text-white/70">Accuracy Rate</div>
              <Shield className="mx-auto mt-3 text-accent-cyan" size={24} />
            </GlassCard>

            <GlassCard className="p-6 text-center glow-border">
              <div className="text-4xl font-bold text-accent-cyan mb-2">
                {counters.cities}
              </div>
              <div className="text-white/70">Cities Protected</div>
              <Zap className="mx-auto mt-3 text-accent-cyan" size={24} />
            </GlassCard>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link to="/dashboard">
              <AnimatedButton size="lg" className="group">
                <span className="flex items-center gap-2">
                  View Live Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </AnimatedButton>
            </Link>

            <Link to="/predictions">
              <AnimatedButton variant="secondary" size="lg" className="group">
                <span className="flex items-center gap-2">
                  <Play size={20} />
                  Predict Risk Now
                </span>
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Info Cards */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="space-y-6">
          <GlassCard className="p-4 w-72 animate-float">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-risk-high rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-white">High-Risk Zones Detected</h3>
            </div>
            <p className="text-white/70 text-sm">3 critical areas identified in downtown</p>
          </GlassCard>

          <GlassCard className="p-4 w-72 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-accent-cyan rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-white">Live Traffic & Weather AI</h3>
            </div>
            <p className="text-white/70 text-sm">Real-time analysis active across the city</p>
          </GlassCard>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Landing