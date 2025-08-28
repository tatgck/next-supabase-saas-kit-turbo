import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.08
}) => {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: staggerDelay, 
        delayChildren: delay,
        duration: 0.5
      }
    }
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.6
      }
    },
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    }
  }

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
      style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "center",
        lineHeight: 1.1
      }}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          style={{ 
            display: "inline-block",
            marginRight: index < words.length - 1 ? "0.25em" : "0"
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  )
}