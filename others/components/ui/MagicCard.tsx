import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagicCardProps {
  children: React.ReactNode
  className?: string
  gradientColor?: string
  hover?: boolean
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientColor = "#262626",
  hover = true
}) => {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-background p-6",
        hover && "hover:shadow-2xl transition-shadow duration-300",
        className
      )}
      whileHover={hover ? { y: -5 } : {}}
      style={{
        background: `radial-gradient(circle at center, ${gradientColor}10 0%, transparent 70%)`
      }}
    >
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Magic glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${gradientColor}15, transparent 40%)`
        }}
      />
    </motion.div>
  )
}