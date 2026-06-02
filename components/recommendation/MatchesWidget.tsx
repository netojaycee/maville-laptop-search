'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import {
  SparklesIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { getScoreColor } from '@/lib/utils'

export function MatchesWidget() {
  const [mounted, setMounted]     = useState(false)
  const [minimized, setMinimized] = useState(false)
  const containerRef              = useRef<HTMLDivElement>(null)

  // Avoid sessionStorage hydration mismatch
  useEffect(() => setMounted(true), [])

  const { results, isOpen, open, clearResults } = useRecommendationStore()

  if (!mounted || isOpen || results.length === 0) return null

  const top3 = results.slice(0, 3)
  const best = results[0]

  // Prevent Framer Motion from treating button/link clicks as drag starts
  const noDrag = { onPointerDown: (e: React.PointerEvent) => e.stopPropagation() }

  return (
    // Full-viewport invisible container — provides the drag boundary
    <div
      ref={containerRef}
      className="fixed inset-0 z-[45] pointer-events-none"
      aria-hidden
    >
      <motion.div
        drag
        dragConstraints={containerRef}
        dragMomentum={false}
        dragElastic={0.06}
        whileDrag={{ scale: 1.03, opacity: 0.9, cursor: 'grabbing' }}
        // Initial position: bottom-right corner
        className="absolute bottom-6 right-4 pointer-events-auto cursor-grab select-none"
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* ── Minimised pill ─────────────────────────────────────────────── */}
          {minimized ? (
            <motion.button
              key="pill"
              {...noDrag}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{   opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              onClick={() => setMinimized(false)}
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] shadow-xl hover:scale-105 transition-transform"
              aria-label="Expand matches"
            >
              <SparklesIcon className="h-5 w-5 text-[var(--primary)]" />
              {/* Count badge */}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[9px] font-bold text-[var(--primary-foreground)]">
                {results.length}
              </span>
            </motion.button>

          ) : (
          /* ── Full card ──────────────────────────────────────────────────── */
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.88, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.88, y: 12  }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="w-72 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl"
            >
              {/* Header — the natural drag-handle area */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <SparklesIcon className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-xs font-semibold text-[var(--foreground)]">
                    {results.length} match{results.length !== 1 ? 'es' : ''} found
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  {/* Minimise */}
                  <button
                    {...noDrag}
                    onClick={() => setMinimized(true)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                    aria-label="Minimise widget"
                  >
                    <ChevronDownIcon className="h-3.5 w-3.5" />
                  </button>
                  {/* Clear / dismiss */}
                  <button
                    {...noDrag}
                    onClick={clearResults}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                    aria-label="Clear results"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails — each is a Link to the laptop page */}
              <div className="flex items-center gap-2 px-4 py-3">
                {top3.map((result, i) => {
                  const img        = result.laptop.images?.[0]
                  const scoreColor = getScoreColor(result.totalScore)

                  return (
                    <Link
                      key={result.laptop.id}
                      href={`/laptops/${result.laptop.slug}`}
                      {...noDrag}
                      className="group relative flex-shrink-0"
                      title={`${result.laptop.brand} ${result.laptop.model} — score ${result.totalScore}`}
                    >
                      <div
                        className="relative h-14 w-14 overflow-hidden rounded-xl border-2 bg-[var(--secondary)] transition-transform duration-200 group-hover:scale-110"
                        style={{ borderColor: i === 0 ? scoreColor : 'var(--border)' }}
                      >
                        {img ? (
                          <Image
                            src={img}
                            alt={result.laptop.model}
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xl opacity-40">💻</div>
                        )}
                      </div>
                      {/* Score badge */}
                      <span
                        className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-black shadow"
                        style={{ background: scoreColor }}
                      >
                        {result.totalScore}
                      </span>
                    </Link>
                  )
                })}

                {/* +N overflow */}
                {results.length > 3 && (
                  <button
                    {...noDrag}
                    onClick={open}
                    className="flex h-14 w-14 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                    title="View all matches"
                  >
                    +{results.length - 3}
                  </button>
                )}
              </div>

              {/* Best match label */}
              <div className="px-4 pb-2">
                <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                  Best match
                </p>
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {best.laptop.brand} {best.laptop.model}
                </p>
              </div>

              {/* CTA — the ONLY thing that opens the modal */}
              <div className="border-t border-[var(--border)] px-4 py-2.5">
                <button
                  {...noDrag}
                  onClick={open}
                  className="w-full rounded-xl bg-[var(--primary)] py-2.5 text-center text-xs font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 active:scale-95"
                >
                  View all {results.length} matches →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
