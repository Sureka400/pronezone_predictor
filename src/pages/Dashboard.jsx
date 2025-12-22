import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  TrendingDown, 
  Cloud, 
  Car, 
  Activity,
  MapPin,
  Clock,
  Users
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import RiskBadge from '../components/RiskBadge'
import SidebarFilters from '../components/SidebarFilters'
import SimpleMap from '../components/SimpleMap'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filters, setFilters] = useState({})
  const [liveData, setLiveData] = useState({
    totalAccidents: 247,
    predictedZones: 8,
    weatherImpact: 68,
    trafficCongestion: 42
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        trafficCongestion: Math.max(20, Math.min(80, prev.trafficCongestion + (Math.random() - 0.5) * 10)),
        weatherImpact: Math.max(30, Math.min(90, prev.weatherImpact + (Math.random() - 0.5) * 5))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

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

  const statCards = [
    {
      title: 'Total Accidents',
      value: liveData.totalAccidents,
      period: 'This Month',
      trend: -12,
      icon: AlertTriangle,
      color: 'text-risk-high'
    },
    {
      title: 'AI Predicted Zones',
      value: liveData.predictedZones,
      period: 'High Risk Areas',
      status: 'active',
      icon: MapPin,
      color: 'text-accent-cyan'
    },
    {
      title: 'Weather Impact',
      value: liveData.weatherImpact,
      period: 'Risk Score',
      icon: Cloud,
      color: 'text-risk-medium'
    },
    {
      title: 'Traffic Congestion',
      value: liveData.trafficCongestion,
      period: 'Congestion Level',
      icon: Car,
      color: 'text-accent-purple'
    }
  ]

  const recentAlerts = [
    {
      id: 1,
      location: 'Downtown Intersection',
      risk: 'high',
      time: '2 min ago',
      description: 'Heavy traffic + rain conditions'
    },
    {
      id: 2,
      location: 'Highway 101 Exit',
      risk: 'medium',
      time: '5 min ago',
      description: 'Construction zone detected'
    },
    {
      id: 3,
      location: 'School District Area',
      risk: 'low',
      time: '12 min ago',
      description: 'Normal conditions'
    }
  ]

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Smart City Dashboard
          </h1>
          <p className="text-white/70">
            Real-time accident risk monitoring and prediction
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((card, index) => (
            <GlassCard key={index} className="p-6 glow-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-white/90 font-medium text-sm mb-1">
                    {card.title}
                  </h3>
                  {card.trend && (
                    <div className="flex items-center gap-1 text-xs">
                      <TrendingDown size={12} className="text-risk-low" />
                      <span className="text-risk-low">{Math.abs(card.trend)}%</span>
                    </div>
                  )}
                  {card.status && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-risk-low rounded-full animate-pulse"></div>
                      <span className="text-xs text-risk-low">Active</span>
                    </div>
                  )}
                </div>
                <card.icon className={`${card.color} opacity-80`} size={24} />
              </div>

              <div className="mb-3">
                <div className={`text-3xl font-bold ${card.color} mb-1`}>
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  {card.title.includes('Impact') || card.title.includes('Congestion') ? '%' : ''}
                </div>
                <div className="text-white/60 text-sm">{card.period}</div>
              </div>

              {/* Mini visualization */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    card.title.includes('Impact') ? 'bg-risk-medium' :
                    card.title.includes('Congestion') ? 'bg-accent-purple' :
                    card.title.includes('Predicted') ? 'bg-accent-cyan' :
                    'bg-risk-high'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${
                      card.title.includes('Impact') ? card.value :
                      card.title.includes('Congestion') ? card.value :
                      card.title.includes('Predicted') ? (card.value / 10) * 100 :
                      75
                    }%` 
                  }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Risk Map */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-accent-cyan">Live Risk Heatmap</h2>
              </div>

              {/* Real Interactive Map */}
              <div className="h-80 rounded-lg overflow-hidden">
                <SimpleMap 
                  height="320px" 
                  zoom={13}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 h-96">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-accent-cyan" size={20} />
                <h2 className="text-xl font-bold text-white">Recent Alerts</h2>
              </div>

              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{alert.location}</h4>
                      <RiskBadge level={alert.risk} size="sm" />
                    </div>
                    <p className="text-white/70 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Clock size={12} />
                      {alert.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="w-full mt-4 py-2 text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View All Alerts
              </motion.button>
            </GlassCard>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mt-8">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.button
                className="p-4 bg-accent-cyan/10 hover:bg-accent-cyan/20 rounded-lg transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="text-accent-cyan mb-2" size={24} />
                <div className="font-medium text-white">Generate Report</div>
                <div className="text-white/60 text-sm">Export analytics data</div>
              </motion.button>

              <motion.button
                className="p-4 bg-accent-purple/10 hover:bg-accent-purple/20 rounded-lg transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AlertTriangle className="text-accent-purple mb-2" size={24} />
                <div className="font-medium text-white">Set Alert</div>
                <div className="text-white/60 text-sm">Configure notifications</div>
              </motion.button>

              <motion.button
                className="p-4 bg-accent-teal/10 hover:bg-accent-teal/20 rounded-lg transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MapPin className="text-accent-teal mb-2" size={24} />
                <div className="font-medium text-white">Add Zone</div>
                <div className="text-white/60 text-sm">Mark new risk area</div>
              </motion.button>

              <motion.button
                className="p-4 bg-risk-medium/10 hover:bg-risk-medium/20 rounded-lg transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Activity className="text-risk-medium mb-2" size={24} />
                <div className="font-medium text-white">Run Prediction</div>
                <div className="text-white/60 text-sm">Analyze future risks</div>
              </motion.button>
            </div>
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

export default Dashboard