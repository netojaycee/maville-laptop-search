'use client'

import { motion } from 'framer-motion'
import { getScoreColor, getScoreLabel } from '@/lib/utils'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
}

export function ScoreRing({ score, size = 64, strokeWidth = 5, showLabel = true }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = getScoreColor(score)

  return (
    <div className="relative flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }} aria-label={`Score: ${score} out of 100`}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E2530"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs text-[#8B97A8]">{getScoreLabel(score)}</span>
      )}
    </div>
  )
}
