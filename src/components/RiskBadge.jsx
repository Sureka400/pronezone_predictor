import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../utils/cn'

const RiskBadge = ({ level, size = 'md', showIcon = true, className }) => {
  const getRiskConfig = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          color: 'risk-high',
          icon: AlertTriangle,
          text: 'High Risk',
          bgClass: 'bg-risk-high/20 border-risk-high/30 text-risk-high'
        }
      case 'medium':
        return {
          color: 'risk-medium',
          icon: AlertCircle,
          text: 'Medium Risk',
          bgClass: 'bg-risk-medium/20 border-risk-medium/30 text-risk-medium'
        }
      case 'low':
        return {
          color: 'risk-low',
          icon: CheckCircle,
          text: 'Safe Zone',
          bgClass: 'bg-risk-low/20 border-risk-low/30 text-risk-low'
        }
      default:
        return {
          color: 'accent-cyan',
          icon: AlertCircle,
          text: 'Unknown',
          bgClass: 'bg-accent-cyan/20 border-accent-cyan/30 text-accent-cyan'
        }
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  }

  const config = getRiskConfig(level)
  const Icon = config.icon

  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium',
        config.bgClass,
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{config.text}</span>
    </motion.div>
  )
}

export default RiskBadge