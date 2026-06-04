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

const USE_CASES = [
  { id: 'gaming',      label: 'Gaming',        icon: '🎮', desc: 'Runs the latest games smoothly' },
  { id: 'editing',     label: 'Video Editing',  icon: '🎬', desc: 'Handles 4K footage & renders' },
  { id: 'programming', label: 'Programming',    icon: '💻', desc: 'Fast compile times, great battery' },
  { id: 'school',      label: 'School',         icon: '📚', desc: 'Light, affordable, long battery' },
  { id: 'office',      label: 'Office Work',    icon: '📊', desc: 'Documents, spreadsheets, calls' },
  { id: 'design',      label: 'Graphic Design', icon: '🎨', desc: 'Creative apps, colour accuracy' },
  { id: 'general',     label: 'General Use',    icon: '🌐', desc: 'Browsing, media, everyday tasks' },
]

export function UseCaseStep() {
  const { preferences, setPreference, nextStep, prevStep } = useRecommendationStore()
  const selected: string[] = (preferences.useCases as string[]) ?? []

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id]
    setPreference('useCases', next)
  }

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="flex flex-col gap-6"
    >
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
          What will you mainly use it for?
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Select all that apply — we&apos;ll find laptops that handle everything you need
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
        {USE_CASES.map((uc) => {
          const isSelected = selected.includes(uc.id)
          return (
            <motion.button
              key={uc.id}
              onClick={() => toggle(uc.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all sm:p-4 ${
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_20px_rgba(0,212,255,0.12)]'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
              }`}
            >
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)]">
                  <CheckIcon className="h-3 w-3 text-[var(--primary-foreground)]" />
                </span>
              )}
              <span className="text-2xl">{uc.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                  {uc.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{uc.desc}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-[var(--muted-foreground)]">
          {selected.length} selected:{' '}
          <span className="text-[var(--primary)]">
            {selected.map((id) => USE_CASES.find((u) => u.id === id)?.label).join(', ')}
          </span>
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
        <Button
          onClick={nextStep}
          disabled={selected.length === 0}
          className="flex-1 font-semibold disabled:opacity-50"
        >
          Continue →
        </Button>
      </div>
    </motion.div>
  )
}
