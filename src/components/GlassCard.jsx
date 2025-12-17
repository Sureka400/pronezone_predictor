import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

const GlassCard = ({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  onClick,
  ...props 
}) => {
  return (
    <motion.div
      className={cn(
        'glass-card transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:shadow-2xl',
        glow && 'glow-border',
        className
      )}
      whileHover={hover ? { y: -5 } : {}}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard