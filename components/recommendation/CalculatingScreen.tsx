'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  'Scanning inventory...',
  'Running analysis...',
  'Matching your preferences...',
  'Calculating scores...',
  'Finding your perfect match...',
]

export function CalculatingScreen() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Animated rings */}
      <div className="relative flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[#00D4FF]"
            style={{ width: 60 + i * 40, height: 60 + i * 40 }}
            animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#00D4FF]/20">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-2xl"
          >
            💻
          </motion.span>
        </div>
      </div>

      <div className="h-8 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-medium text-[#8B97A8]"
          >
            {MESSAGES[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.p
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs text-[#8B97A8]"
      >
        This usually takes about 2–3 seconds
      </motion.p>
    </div>
  )
}
