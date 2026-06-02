'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { BudgetStep }      from './steps/BudgetStep'
import { UseCaseStep }     from './steps/UseCaseStep'
import { PerformanceStep } from './steps/PerformanceStep'
import { PortabilityStep } from './steps/PortabilityStep'
import { FeaturesStep }    from './steps/FeaturesStep'
import { CalculatingScreen } from './CalculatingScreen'
import { ResultsReveal }     from './ResultsReveal'
import { XMarkIcon }         from '@heroicons/react/24/outline'

const STEPS = [BudgetStep, UseCaseStep, PerformanceStep, PortabilityStep, FeaturesStep]
const TOTAL = STEPS.length // 5

export function RecommendationModal() {
  const {
    isOpen, currentStep, isCalculating, results, close, reset, startFresh,
  } = useRecommendationStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [close])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Display logic ──────────────────────────────────────────────────────────
  // Priority: Calculating → Results → Step
  // isCalculating is set true BEFORE the fetch; false after results arrive.
  // Results are shown once isCalculating=false AND results.length>0.
  // We do NOT need to advance currentStep past the quiz steps — that was
  // causing the bug (nextStep() capped at 4, so step 4 stayed rendered).
  const showCalculating = isCalculating
  const showResults     = !isCalculating && results.length > 0
  const showStep        = !showCalculating && !showResults

  const StepComponent = showStep ? STEPS[Math.min(currentStep, TOTAL - 1)] : null
  const progressPct   = ((currentStep + 1) / TOTAL) * 100

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.96, y: 16  }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[4%] z-50 mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl sm:inset-x-auto sm:w-full"
            style={{ maxHeight: '92vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar — only visible during quiz */}
            {showStep && (
              <div className="h-1 bg-[var(--secondary)]">
                <motion.div
                  className="h-full bg-[var(--primary)]"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[var(--foreground)]">
                  {showResults     ? '🎉 Your matches'      :
                   showCalculating ? 'Analysing…'           :
                                     'Find My Laptop'}
                </span>
                {showStep && (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {currentStep + 1}/{TOTAL}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {showResults && (
                  <button
                    onClick={startFresh}
                    className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                  >
                    New search
                  </button>
                )}
                <button
                  onClick={reset}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: 'calc(92vh - 80px)' }}>
              <AnimatePresence mode="wait">
                {showCalculating && <CalculatingScreen key="calc" />}
                {showResults     && <ResultsReveal     key="results" />}
                {StepComponent   && <StepComponent     key={`step-${currentStep}`} />}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
