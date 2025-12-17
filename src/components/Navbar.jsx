import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, User, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Predictions', path: '/predictions' },
    { name: 'Heatmap', path: '/heatmap' },
    { name: 'Insights', path: '/insights' },
    { name: 'About', path: '/about' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg flex items-center justify-center relative">
              <div className="w-4 h-4 bg-white rounded opacity-90"></div>
            </div>
            <span className="text-xl font-bold gradient-text">SafeCity AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 rounded-full transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-accent-cyan bg-accent-cyan/10'
                    : 'text-white/70 hover:text-accent-cyan hover:bg-white/5'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute inset-0 bg-accent-cyan/20 rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <ChevronDown size={16} className="text-white/70" />
              </button>

              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 glass-card p-2"
                >
                  <div className="px-3 py-2 text-sm text-white/70">
                    <div className="font-medium text-white">Admin User</div>
                    <div>admin@safecity.ai</div>
                  </div>
                  <hr className="border-white/20 my-2" />
                  <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded">
                    Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded">
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'text-accent-cyan bg-accent-cyan/10'
                      : 'text-white/70 hover:text-accent-cyan hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-white/20 my-2" />
              <div className="px-3 py-2 text-sm text-white/70">
                <div className="font-medium text-white">Admin User</div>
                <div>admin@safecity.ai</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar