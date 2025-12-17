import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Insights = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('accidents')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for charts
  const accidentTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Accidents',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 38, 42, 35, 28],
        borderColor: '#ff4c4c',
        backgroundColor: 'rgba(255, 76, 76, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Predicted',
        data: [55, 49, 70, 71, 46, 45, 30, 35, 28, 32, 25, 18],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        tension: 0.4,
        fill: true,
        borderDash: [5, 5],
      }
    ]
  }

  const areaRiskData = {
    labels: ['Downtown', 'Highway 101', 'School District', 'Shopping Mall', 'Industrial Zone', 'Residential'],
    datasets: [
      {
        label: 'Risk Score',
        data: [78, 54, 28, 65, 42, 31],
        backgroundColor: [
          '#ff4c4c',
          '#ffb020',
          '#2ed573',
          '#ff4c4c',
          '#ffb020',
          '#2ed573'
        ],
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      }
    ]
  }

  const timePatternData = {
    labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM', '3 AM'],
    datasets: [
      {
        label: 'Accident Frequency',
        data: [12, 45, 28, 35, 67, 42, 18, 8],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
      }
    ]
  }

  const riskDistributionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [25, 35, 40],
        backgroundColor: ['#ff4c4c', '#ffb020', '#2ed573'],
        borderColor: ['#ff4c4c', '#ffb020', '#2ed573'],
        borderWidth: 2,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.9)',
        titleColor: '#00d4ff',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: 'Inter'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          font: {
            family: 'Inter'
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter'
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.9)',
        titleColor: '#00d4ff',
        bodyColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
      }
    }
  }

  const timeRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ]

  const keyMetrics = [
    {
      title: 'Total Accidents',
      value: '247',
      change: -12,
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-risk-high'
    },
    {
      title: 'Risk Zones',
      value: '8',
      change: +2,
      trend: 'up',
      icon: MapPin,
      color: 'text-accent-cyan'
    },
    {
      title: 'Avg Response Time',
      value: '4.2m',
      change: -8,
      trend: 'down',
      icon: Clock,
      color: 'text-accent-purple'
    },
    {
      title: 'People Affected',
      value: '1,247',
      change: -15,
      trend: 'down',
      icon: Users,
      color: 'text-accent-teal'
    }
  ]

  const refreshData = async () => {
    setIsLoading(true)
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Analytics & <span className="gradient-text">Insights</span>
              </h1>
              <p className="text-xl text-white/70">
                Comprehensive data analysis and trends for accident prevention
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex bg-white/10 rounded-lg p-1">
                {timeRanges.map((range) => (
                  <motion.button
                    key={range.id}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeRange === range.id
                        ? 'bg-accent-cyan text-primary-dark'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setTimeRange(range.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {range.label}
                  </motion.button>
                ))}
              </div>
              
              <AnimatedButton
                variant="secondary"
                onClick={refreshData}
                loading={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </AnimatedButton>
              
              <AnimatedButton variant="secondary" className="flex items-center gap-2">
                <Download size={16} />
                Export
              </AnimatedButton>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <GlassCard key={index} className="p-6 glow-border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white/90 font-medium text-sm mb-1">
                      {metric.title}
                    </h3>
                    <div className={`flex items-center gap-2 text-xs ${
                      metric.trend === 'up' ? 'text-risk-high' : 'text-risk-low'
                    }`}>
                      <TrendingUp 
                        size={12} 
                        className={metric.trend === 'down' ? 'rotate-180' : ''} 
                      />
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  <Icon className={`${metric.color} opacity-80`} size={24} />
                </div>

                <div className="mb-3">
                  <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                    {metric.value}
                  </div>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      metric.color.includes('risk-high') ? 'bg-risk-high' :
                      metric.color.includes('accent-cyan') ? 'bg-accent-cyan' :
                      metric.color.includes('accent-purple') ? 'bg-accent-purple' :
                      'bg-accent-teal'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(metric.change) * 5}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </GlassCard>
            )
          })}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accident Trends */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 h-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-accent-cyan" size={20} />
                  Accident Trends
                </h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-accent-cyan text-primary-dark rounded-lg text-sm font-medium">
                    Monthly
                  </button>
                  <button className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-sm">
                    Weekly
                  </button>
                </div>
              </div>
              <div className="h-72">
                <Line data={accidentTrendData} options={chartOptions} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Area Risk Analysis */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 h-96">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-accent-cyan" size={20} />
                Risk by Area
              </h2>
              <div className="h-72">
                <Bar data={areaRiskData} options={chartOptions} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Time Pattern Analysis */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 h-96">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="text-accent-cyan" size={20} />
                Hourly Patterns
              </h2>
              <div className="h-72">
                <Bar data={timePatternData} options={chartOptions} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Risk Distribution */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 h-96">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="text-accent-cyan" size={20} />
                Risk Distribution
              </h2>
              <div className="h-72">
                <Doughnut data={riskDistributionData} options={doughnutOptions} />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Insights Summary */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-accent-cyan" size={24} />
              Key Insights & Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">
                <h3 className="font-semibold text-accent-cyan mb-2">Peak Risk Hours</h3>
                <p className="text-white/80 text-sm mb-3">
                  Accidents spike during 6-7 PM rush hour, with 67% increase in incidents.
                </p>
                <div className="text-xs text-accent-cyan">
                  → Increase patrol presence during evening rush
                </div>
              </div>

              <div className="p-4 bg-accent-purple/10 rounded-lg border border-accent-purple/20">
                <h3 className="font-semibold text-accent-purple mb-2">Weather Impact</h3>
                <p className="text-white/80 text-sm mb-3">
                  Rainy conditions correlate with 45% increase in accident rates.
                </p>
                <div className="text-xs text-accent-purple">
                  → Deploy weather-responsive traffic management
                </div>
              </div>

              <div className="p-4 bg-accent-teal/10 rounded-lg border border-accent-teal/20">
                <h3 className="font-semibold text-accent-teal mb-2">High-Risk Zones</h3>
                <p className="text-white/80 text-sm mb-3">
                  Downtown and Shopping Mall areas account for 60% of all incidents.
                </p>
                <div className="text-xs text-accent-teal">
                  → Focus infrastructure improvements on these areas
                </div>
              </div>

              <div className="p-4 bg-risk-medium/10 rounded-lg border border-risk-medium/20">
                <h3 className="font-semibold text-risk-medium mb-2">Seasonal Trends</h3>
                <p className="text-white/80 text-sm mb-3">
                  Winter months show 30% higher accident rates due to weather conditions.
                </p>
                <div className="text-xs text-risk-medium">
                  → Prepare enhanced winter safety measures
                </div>
              </div>

              <div className="p-4 bg-risk-low/10 rounded-lg border border-risk-low/20">
                <h3 className="font-semibold text-risk-low mb-2">Prevention Success</h3>
                <p className="text-white/80 text-sm mb-3">
                  AI predictions have helped reduce accidents by 35% in monitored areas.
                </p>
                <div className="text-xs text-risk-low">
                  → Expand AI monitoring to more locations
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                <h3 className="font-semibold text-white mb-2">Response Time</h3>
                <p className="text-white/80 text-sm mb-3">
                  Average emergency response time improved by 8% with better prediction.
                </p>
                <div className="text-xs text-white/70">
                  → Continue optimizing emergency protocols
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Insights