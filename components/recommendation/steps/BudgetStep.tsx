'use client'

import { motion } from 'framer-motion'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
}

const PRESETS = [
  { label: 'Under ₦150k', min: 0, max: 150000 },
  { label: '₦150k–300k', min: 150000, max: 300000 },
  { label: '₦300k–500k', min: 300000, max: 500000 },
  { label: 'Over ₦500k', min: 500000, max: 2000000 },
]

export function BudgetStep() {
  const { preferences, setPreference, nextStep } = useRecommendationStore()
  const min = preferences.budgetMin ?? 50000
  const max = preferences.budgetMax ?? 300000

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
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">What&apos;s your budget?</h2>
        <p className="text-[var(--muted-foreground)]">We&apos;ll find the best value within your range</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Minimum</p>
            <p className="font-mono text-2xl font-bold text-[var(--primary)]">₦{formatPrice(min)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Maximum</p>
            <p className="font-mono text-2xl font-bold text-[var(--foreground)]">₦{formatPrice(max)}</p>
          </div>
        </div>

        <Slider
          min={20000}
          max={2000000}
          step={10000}
          value={[min, max]}
          onValueChange={(val) => {
            const vals = Array.isArray(val) ? val : [val]
            setPreference('budgetMin', vals[0] ?? 0)
            setPreference('budgetMax', vals[1] ?? vals[0] ?? 0)
          }}
        />

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setPreference('budgetMin', p.min); setPreference('budgetMax', p.max) }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                min === p.min && max === p.max
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={nextStep} className="h-12 text-base font-semibold">
        Continue →
      </Button>
    </motion.div>
  )
}
