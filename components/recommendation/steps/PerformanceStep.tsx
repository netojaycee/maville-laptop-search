'use client'

import { motion } from 'framer-motion'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { Button } from '@/components/ui/button'

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
}

const OPTIONS = [
  { id: 'maximum' as const, label: 'Maximum Performance', icon: '⚡', desc: 'Fastest CPU & GPU — handles anything. Battery life is secondary.' },
  { id: 'balanced' as const, label: 'Balanced', icon: '⚖️', desc: 'Great performance with decent battery. Best of both worlds.' },
  { id: 'battery' as const, label: 'Battery First', icon: '🔋', desc: 'All-day battery life. Performance still good for everyday use.' },
]

export function PerformanceStep() {
  const { preferences, setPreference, nextStep, prevStep } = useRecommendationStore()
  const selected = preferences.performancePreference

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="flex flex-col gap-8"
    >
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Performance or battery?</h2>
        <p className="text-[var(--muted-foreground)]">How do you prioritise power vs longevity?</p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => setPreference('performancePreference', opt.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
              selected === opt.id
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_20px_rgba(0,212,255,0.12)]'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <span className="mt-0.5 text-2xl">{opt.icon}</span>
            <div>
              <p className={`font-semibold ${selected === opt.id ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                {opt.label}
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{opt.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
        <Button onClick={nextStep} disabled={!selected} className="flex-1 font-semibold">Continue →</Button>
      </div>
    </motion.div>
  )
}
