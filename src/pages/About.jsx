import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Brain, 
  MapPin, 
  Users, 
  Award, 
  Target,
  Zap,
  Globe,
  Database,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Github,
  Mail,
  Phone
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedButton from '../components/AnimatedButton'

const About = () => {
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

  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Algorithms',
      description: 'Machine learning models trained on millions of data points to predict accident risks with 94% accuracy.',
      color: 'text-accent-cyan'
    },
    {
      icon: MapPin,
      title: 'Real-time Mapping',
      description: 'Interactive heatmaps showing live risk zones updated every minute with current traffic and weather data.',
      color: 'text-accent-purple'
    },
    {
      icon: Database,
      title: 'Multi-source Integration',
      description: 'Combines traffic cameras, weather stations, historical records, and IoT sensors for comprehensive analysis.',
      color: 'text-accent-teal'
    },
    {
      icon: Shield,
      title: 'Proactive Prevention',
      description: 'Early warning system that alerts authorities before accidents occur, enabling preventive measures.',
      color: 'text-risk-low'
    }
  ]

  const stats = [
    { number: '2,847', label: 'Accidents Prevented', icon: Shield },
    { number: '94%', label: 'Prediction Accuracy', icon: Target },
    { number: '15', label: 'Cities Protected', icon: Globe },
    { number: '24/7', label: 'Monitoring', icon: Zap }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'AI Research Director',
      expertise: 'Machine Learning, Computer Vision',
      image: '👩‍💻'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Smart City Solutions Lead',
      expertise: 'Urban Planning, IoT Integration',
      image: '👨‍💼'
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Data Science Manager',
      expertise: 'Statistical Analysis, Predictive Modeling',
      image: '👩‍🔬'
    },
    {
      name: 'James Thompson',
      role: 'Frontend Architect',
      expertise: 'React, UI/UX Design, Data Visualization',
      image: '👨‍💻'
    }
  ]

  const dataSources = [
    {
      category: 'Traffic Data',
      sources: [
        'Traffic cameras and sensors',
        'GPS tracking from vehicles',
        'Road condition monitors',
        'Speed detection systems'
      ],
      icon: MapPin,
      color: 'accent-cyan'
    },
    {
      category: 'Weather Data',
      sources: [
        'Meteorological stations',
        'Satellite weather imagery',
        'Road surface sensors',
        'Visibility monitors'
      ],
      icon: Globe,
      color: 'accent-purple'
    },
    {
      category: 'Historical Records',
      sources: [
        'Police accident reports',
        'Insurance claim data',
        'Emergency response logs',
        'Hospital admission records'
      ],
      icon: Database,
      color: 'accent-teal'
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
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            About <span className="gradient-text">SafeCity AI</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing urban safety through artificial intelligence, 
            creating smarter cities that predict and prevent accidents before they happen.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div variants={itemVariants} className="mb-16">
          <GlassCard className="p-8 text-center glow-border">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-6">
                To create safer, smarter cities by leveraging cutting-edge AI technology 
                to predict accident-prone zones and enable proactive safety measures. 
                We believe that every accident prevented is a life saved and a community protected.
              </p>
              <div className="flex justify-center">
                <Shield className="text-accent-cyan" size={48} />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <GlassCard key={index} className="p-6 text-center glow-border">
                <Icon className="text-accent-cyan mx-auto mb-4" size={32} />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/70">{stat.label}</div>
              </GlassCard>
            )
          })}
        </motion.div>

        {/* Key Features */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It <span className="gradient-text">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <GlassCard className="p-6 h-full">
                    <Icon className={`${feature.color} mb-4`} size={32} />
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Data Sources Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Real-time <span className="gradient-text">Data Sources</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dataSources.map((source, index) => {
              const Icon = source.icon
              return (
                <GlassCard key={index} className="p-6 glow-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`text-${source.color}`} size={24} />
                    <h3 className="text-xl font-bold text-white">{source.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {source.sources.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white/70">
                        <CheckCircle size={16} className={`text-${source.color}`} />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )
            })}
          </div>
        </motion.div>

        {/* Data APIs and Sources */}
        <motion.div variants={itemVariants} className="mb-16">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Database className="text-accent-cyan" size={24} />
              Real-time Data APIs for Training
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-accent-cyan mb-4">Traffic & Transportation</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">Google Maps Traffic API</strong>
                    <p className="text-white/70">Real-time traffic conditions, congestion levels</p>
                    <code className="text-accent-cyan text-xs">maps.googleapis.com/maps/api/directions</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">HERE Traffic API</strong>
                    <p className="text-white/70">Live traffic flow, incidents, road closures</p>
                    <code className="text-accent-cyan text-xs">traffic.ls.hereapi.com/traffic</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">TomTom Traffic API</strong>
                    <p className="text-white/70">Traffic density, speed data, incidents</p>
                    <code className="text-accent-cyan text-xs">api.tomtom.com/traffic</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-accent-purple mb-4">Weather & Environment</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">OpenWeatherMap API</strong>
                    <p className="text-white/70">Current weather, forecasts, alerts</p>
                    <code className="text-accent-purple text-xs">api.openweathermap.org/data/2.5</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">WeatherAPI</strong>
                    <p className="text-white/70">Real-time weather, air quality, UV index</p>
                    <code className="text-accent-purple text-xs">api.weatherapi.com/v1</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">NOAA Weather Service</strong>
                    <p className="text-white/70">Official weather data, severe weather alerts</p>
                    <code className="text-accent-purple text-xs">api.weather.gov</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-accent-teal mb-4">Government & Public Data</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">NHTSA Crash Data</strong>
                    <p className="text-white/70">Historical accident records, fatality data</p>
                    <code className="text-accent-teal text-xs">crashviewer.nhtsa.dot.gov/api</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">City Open Data Portals</strong>
                    <p className="text-white/70">Local traffic incidents, road conditions</p>
                    <code className="text-accent-teal text-xs">data.cityname.gov/api</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">Police Department APIs</strong>
                    <p className="text-white/70">Real-time incident reports, emergency calls</p>
                    <code className="text-accent-teal text-xs">data.police.gov/incidents</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-risk-medium mb-4">IoT & Sensor Networks</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">Smart City Sensors</strong>
                    <p className="text-white/70">Traffic counters, air quality, noise levels</p>
                    <code className="text-risk-medium text-xs">iot.smartcity.gov/sensors</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">Road Surface Monitors</strong>
                    <p className="text-white/70">Pavement conditions, ice detection</p>
                    <code className="text-risk-medium text-xs">roads.transport.gov/conditions</code>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <strong className="text-white">Traffic Camera Networks</strong>
                    <p className="text-white/70">Live video feeds, vehicle counting</p>
                    <code className="text-risk-medium text-xs">cameras.traffic.gov/live</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">
              <h4 className="font-semibold text-accent-cyan mb-2">💡 Pro Tip for Data Collection:</h4>
              <p className="text-white/80 text-sm">
                Start with free APIs like OpenWeatherMap and government open data portals. 
                For production, consider premium APIs like Google Maps Platform or HERE for higher rate limits and better accuracy.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Team Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-4">{member.image}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-accent-cyan text-sm mb-2">{member.role}</p>
                  <p className="text-white/60 text-xs">{member.expertise}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div variants={itemVariants} className="mb-16">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Brain className="text-accent-cyan" size={24} />
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-accent-cyan mb-3">AI & Machine Learning</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• TensorFlow & PyTorch</li>
                  <li>• Computer Vision (OpenCV)</li>
                  <li>• Time Series Analysis</li>
                  <li>• Ensemble Methods</li>
                  <li>• Deep Neural Networks</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent-purple mb-3">Data Processing</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• Apache Kafka (Streaming)</li>
                  <li>• Apache Spark (Big Data)</li>
                  <li>• PostgreSQL + PostGIS</li>
                  <li>• Redis (Caching)</li>
                  <li>• Elasticsearch</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-accent-teal mb-3">Frontend & Visualization</h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Framer Motion</li>
                  <li>• Chart.js & D3.js</li>
                  <li>• Leaflet.js (Maps)</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact Section */}
        <motion.div variants={itemVariants} className="text-center">
          <GlassCard className="p-8 glow-border">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Make Your City <span className="gradient-text">Safer</span>?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Contact us to learn how SafeCity AI can be implemented in your city. 
              We offer custom solutions, training, and ongoing support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <AnimatedButton className="flex items-center gap-2">
                <Mail size={20} />
                contact@safecity.ai
              </AnimatedButton>
              <AnimatedButton variant="secondary" className="flex items-center gap-2">
                <Phone size={20} />
                +1 (555) 123-4567
              </AnimatedButton>
              <AnimatedButton variant="secondary" className="flex items-center gap-2">
                <Github size={20} />
                View on GitHub
              </AnimatedButton>
            </div>

            <div className="text-white/50 text-sm">
              © 2024 SafeCity AI. Building safer cities through artificial intelligence.
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default About