import React from 'react'
import { cn } from '@/lib/utils'

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: Array<[x: number, y: number]>
  className?: string
}

export const GridPattern: React.FC<GridPatternProps> = ({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares = [],
  className,
  ...props
}) => {
  const patternId = `grid-pattern-${Math.random().toString(36).substr(2, 9)}`

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/10 stroke-gray-400/10",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}