import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Heatmap from './pages/Heatmap'
import Predictions from './pages/Predictions'
import Results from './pages/Results'
import Insights from './pages/Insights'
import About from './pages/About'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-secondary">
      <Navbar />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/results" element={<Results />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App