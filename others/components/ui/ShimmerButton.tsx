import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  shimmerColor?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  asChild?: boolean
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className,
  shimmerColor = 'rgba(255, 255, 255, 0.5)',
  size = 'md',
  variant = 'default',
  asChild = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const variantClasses = {
    default: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50',
    ghost: 'text-blue-600 bg-transparent hover:bg-blue-50'
  }

  if (asChild) {
    return (
      <motion.div
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 overflow-hidden group',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
            width: '100%',
            height: '100%'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex items-center">
          {children}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 overflow-hidden group',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center">
        {children}
      </span>
    </motion.button>
  )
}