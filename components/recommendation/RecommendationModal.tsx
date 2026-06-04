'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { BudgetStep }      from './steps/BudgetStep'
import { UseCaseStep }     from './steps/UseCaseStep'
import { PerformanceStep } from './steps/PerformanceStep'
import { PortabilityStep } from './steps/PortabilityStep'
import { FeaturesStep }    from './steps/FeaturesStep'
import { CalculatingScreen } from './CalculatingScreen'
import { XMarkIcon }         from '@heroicons/react/24/outline'

const STEPS = [BudgetStep, UseCaseStep, PerformanceStep, PortabilityStep, FeaturesStep]
const TOTAL = STEPS.length

export function RecommendationModal() {
  const router = useRouter()
  const {
    isOpen, currentStep, isCalculating, results, close, reset,
  } = useRecommendationStore()

  // Keyboard close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [close])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Navigate to /results when calculation completes
  useEffect(() => {
    if (!isCalculating && results.length > 0 && isOpen) {
      const timer = setTimeout(() => {
        close()
        router.push('/results')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isCalculating, results.length, isOpen, close, router])

  const showCalculating = isCalculating
  const showStep        = !showCalculating
  const StepComponent   = STEPS[Math.min(currentStep, TOTAL - 1)]
  const progressPct     = ((currentStep + 1) / TOTAL) * 100

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

          {/* Panel — bottom sheet on mobile, centered dialog on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: 32  }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl sm:inset-x-4 sm:bottom-auto sm:top-[4%] sm:max-w-3xl sm:rounded-3xl"
            style={{ maxHeight: '96vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-12 rounded-full bg-[var(--border)]" />
            </div>

            {/* Progress bar */}
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
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[var(--foreground)]">
                  {showCalculating ? 'Analysing…' : 'Find My Laptop'}
                </span>
                {showStep && (
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {currentStep + 1}/{TOTAL}
                  </span>
                )}
              </div>
              <button
                onClick={reset}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-5 py-6 sm:px-7" style={{ maxHeight: 'calc(96vh - 80px)' }}>
              <AnimatePresence mode="wait">
                {showCalculating && <CalculatingScreen key="calc" />}
                {showStep        && <StepComponent     key={`step-${currentStep}`} />}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
