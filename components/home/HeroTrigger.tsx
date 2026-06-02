'use client'

import { useRecommendationStore } from '@/store/useRecommendationStore'
import { analytics } from '@/lib/analytics'
import { motion } from 'framer-motion'

export function HeroTrigger() {
  const { open } = useRecommendationStore()

  const handleClick = () => {
    analytics.recommendationStarted()
    open()
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-xl bg-[#00D4FF] px-8 py-3 font-semibold text-black shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-shadow hover:shadow-[0_0_40px_rgba(0,212,255,0.6)]"
    >
      <span className="relative z-10">Find My Laptop →</span>
    </motion.button>
  )
}
