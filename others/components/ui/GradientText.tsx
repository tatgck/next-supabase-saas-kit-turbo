import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: string
  animate?: boolean
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  gradient = "from-blue-600 via-purple-600 to-blue-800",
  animate = true
}) => {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        `bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold`,
        className
      )}
    >
      {children}
    </motion.div>
  )
}