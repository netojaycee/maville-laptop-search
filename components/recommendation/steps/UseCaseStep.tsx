'use client'

import { motion } from 'framer-motion'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { Button } from '@/components/ui/button'

const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
}

const USE_CASES = [
  { id: 'gaming', label: 'Gaming', icon: '🎮', desc: 'Runs the latest games smoothly' },
  { id: 'editing', label: 'Video Editing', icon: '🎬', desc: 'Handles 4K footage & renders' },
  { id: 'programming', label: 'Programming', icon: '💻', desc: 'Fast compile times, great battery' },
  { id: 'school', label: 'School', icon: '📚', desc: 'Light, affordable, long battery' },
  { id: 'office', label: 'Office Work', icon: '📊', desc: 'Documents, spreadsheets, calls' },
  { id: 'design', label: 'Graphic Design', icon: '🎨', desc: 'Creative apps, colour accuracy' },
  { id: 'general', label: 'General Use', icon: '🌐', desc: 'Browsing, media, everyday tasks' },
]

export function UseCaseStep() {
  const { preferences, setPreference, nextStep, prevStep } = useRecommendationStore()
  const selected = preferences.useCase

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
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">What will you mainly use it for?</h2>
        <p className="text-[var(--muted-foreground)]">This helps us prioritise the right specs</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {USE_CASES.map((uc) => (
          <motion.button
            key={uc.id}
            onClick={() => setPreference('useCase', uc.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
              selected === uc.id
                ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_20px_rgba(0,212,255,0.12)]'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]'
            }`}
          >
            <span className="text-2xl">{uc.icon}</span>
            <div>
              <p className={`text-sm font-semibold ${selected === uc.id ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                {uc.label}
              </p>
              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{uc.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">Back</Button>
        <Button onClick={nextStep} disabled={!selected} className="flex-1 font-semibold disabled:opacity-50">
          Continue →
        </Button>
      </div>
    </motion.div>
  )
}
