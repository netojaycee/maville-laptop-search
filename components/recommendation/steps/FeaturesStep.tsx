'use client'

import { motion } from 'framer-motion'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { Button } from '@/components/ui/button'
import { CheckIcon } from '@heroicons/react/24/solid'

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
}

const FEATURES = [
  { id: 'touchscreen', label: 'Touchscreen', icon: '👆' },
  { id: 'backlit_keyboard', label: 'Backlit Keyboard', icon: '⌨️' },
  { id: 'fingerprint_reader', label: 'Fingerprint Reader', icon: '🔏' },
  { id: 'charger_included', label: 'Charger Included', icon: '🔌' },
  { id: 'additional_ssd_slot', label: 'Extra SSD Slot', icon: '💾' },
  { id: 'ram_upgradeable', label: 'Upgradeable RAM', icon: '🔧' },
]

export function FeaturesStep() {
  const { preferences, setPreference, prevStep, setCalculating, setResults } = useRecommendationStore()
  const selected = preferences.requiredFeatures ?? []

  const toggle = (id: string) => {
    setPreference('requiredFeatures', selected.includes(id) ? selected.filter((f) => f !== id) : [...selected, id])
  }

  const handleSubmit = async () => {
    // Set calculating=true — the modal detects this and switches to CalculatingScreen.
    // We deliberately do NOT call nextStep() here: nextStep() is capped at step 4,
    // so calling it from step 4 does nothing and keeps the step rendered.
    setCalculating(true)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })
      const data = await res.json()
      await new Promise((r) => setTimeout(r, 2500))
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setCalculating(false)
    }
  }

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
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Any must-have features?</h2>
        <p className="text-[var(--muted-foreground)]">Optional — skip if you have no preference</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FEATURES.map((feat) => {
          const active = selected.includes(feat.id)
          return (
            <motion.button
              key={feat.id}
              onClick={() => toggle(feat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                active
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
              }`}
            >
              {active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)]"
                >
                  <CheckIcon className="h-2.5 w-2.5 text-[var(--primary-foreground)]" />
                </motion.div>
              )}
              <span className="text-2xl">{feat.icon}</span>
              <span className={`text-center text-xs font-medium ${active ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                {feat.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
        <Button onClick={handleSubmit} className="flex-1 h-12 text-base font-semibold">
          Find My Laptop →
        </Button>
      </div>
    </motion.div>
  )
}
