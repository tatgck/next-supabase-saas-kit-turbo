import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  gradient?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'filled' | 'outline'
  asChild?: boolean
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className,
  gradient = 'from-blue-600 via-purple-600 to-indigo-600',
  size = 'md',
  variant = 'filled',
  asChild = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const Component = asChild ? motion.div : motion.button

  if (variant === 'outline') {
    return (
      <Component
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 overflow-hidden group border-2 border-white bg-transparent backdrop-blur-sm',
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center text-white">
          {children}
        </span>
      </Component>
    )
  }

  return (
    <Component
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-semibold text-white transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-2xl',
        `bg-gradient-to-r ${gradient}`,
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center">
        {children}
      </span>
    </Component>
  )
}