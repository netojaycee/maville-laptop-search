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
  { id: 'lightweight' as const, label: 'Lightweight', icon: '🪶', weight: '< 1.5kg', desc: 'Ultra-portable. Slips into any bag. Great for commuters.' },
  { id: 'balanced' as const, label: 'Balanced', icon: '🎒', weight: '1.5–2.2kg', desc: 'Light enough for daily carry, powerful enough to work hard.' },
  { id: 'any' as const, label: "Weight doesn't matter", icon: '🖥️', weight: 'Any weight', desc: 'Performance and specs matter more than portability.' },
]

export function PortabilityStep() {
  const { preferences, setPreference, nextStep, prevStep } = useRecommendationStore()
  const selected = preferences.portability

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
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">How portable does it need to be?</h2>
        <p className="text-[var(--muted-foreground)]">Do you carry your laptop around a lot?</p>
      </div>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => (
          <motion.button
            key={opt.id}
            onClick={() => setPreference('portability', opt.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
              selected === opt.id
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_20px_rgba(0,212,255,0.12)]'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <span className="mt-0.5 text-2xl">{opt.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`font-semibold ${selected === opt.id ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                  {opt.label}
                </p>
                <span className="font-mono text-xs text-[var(--muted-foreground)]">{opt.weight}</span>
              </div>
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
