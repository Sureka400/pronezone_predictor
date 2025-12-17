import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  onClick,
  disabled = false,
  loading = false,
  ripple = true,
  ...props 
}) => {
  const [ripples, setRipples] = useState([])

  const variants = {
    primary: 'btn-primary neon-glow',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent border border-white/20 text-white hover:bg-white/10'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const handleClick = (e) => {
    if (disabled || loading) return

    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size
      }

      setRipples(prev => [...prev, newRipple])

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }

    onClick?.(e)
  }

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className={cn('relative z-10', loading && 'opacity-0')}>
        {children}
      </span>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {ripple && ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  )
}

export default AnimatedButton