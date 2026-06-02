'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCompareStore } from '@/store/useCompareStore'
import { XMarkIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { analytics } from '@/lib/analytics'

export function CompareDrawer() {
  const router = useRouter()
  const { selectedIds, remove, clear } = useCompareStore()

  const handleCompare = () => {
    analytics.compareStarted(selectedIds)
    router.push(`/compare?ids=${selectedIds.join(',')}`)
  }

  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted-foreground)]">
                {selectedIds.length}/3 selected
              </span>
              <div className="flex gap-2">
                {selectedIds.map((id) => (
                  <div key={id} className="flex items-center gap-1 rounded-lg bg-[var(--secondary)] px-2 py-1">
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">{id.slice(0, 6)}…</span>
                    <button
                      onClick={() => remove(id)}
                      className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      aria-label="Remove from compare"
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={clear}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedIds.length < 2}
                className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowsRightLeftIcon className="h-4 w-4" />
                Compare Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
