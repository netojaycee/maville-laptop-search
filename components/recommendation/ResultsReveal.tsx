'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { ScoredLaptop } from '@/types'
import { ScoreRing } from '@/components/laptops/ScoreRing'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { formatPrice } from '@/lib/utils'
import { ExclamationTriangleIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'

export function ResultsReveal() {
  const { results, close, startFresh } = useRecommendationStore()

  if (!results.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="text-5xl">😕</div>
        <h3 className="text-xl font-bold text-[var(--foreground)]">No matches found</h3>
        <p className="text-[var(--muted-foreground)]">Try adjusting your budget or preferences</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-display text-2xl font-bold text-[var(--foreground)]">
          {results.length} laptop{results.length > 1 ? 's' : ''} matched
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">Ranked by how well they fit your needs</p>
      </div>

      {results.map((result: ScoredLaptop, i: number) => (
        <motion.div
          key={result.laptop.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
          className={`overflow-hidden rounded-2xl border bg-[var(--card)] p-4 ${
            i === 0 ? 'border-[var(--primary)] shadow-[0_0_30px_rgba(0,212,255,0.1)]' : 'border-[var(--border)]'
          }`}
        >
          {i === 0 && (
            <div className="mb-3 flex items-center gap-1.5">
              <SparklesIcon className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">Best Match</span>
            </div>
          )}

          <div className="flex gap-4">
            <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--secondary)]">
              {result.laptop.images?.[0] ? (
                <Image
                  src={result.laptop.images[0]}
                  alt={`${result.laptop.brand} ${result.laptop.model}`}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl opacity-30">💻</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-[var(--primary)]">{result.laptop.brand}</p>
                  <h3 className="truncate font-semibold text-[var(--foreground)]">{result.laptop.model}</h3>
                  <p className="font-mono text-lg font-bold text-[var(--foreground)]">₦{formatPrice(result.laptop.price)}</p>
                </div>
                <ScoreRing score={result.totalScore} size={56} strokeWidth={4} />
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {result.bestFor.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded bg-[var(--secondary)] px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {result.warnings.length > 0 && (
            <div className="mt-3 space-y-1">
              {result.warnings.map((w, j) => (
                <div key={j} className="flex items-start gap-1.5 text-xs text-[#FFB300]">
                  <ExclamationTriangleIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {result.upgradeSuggestions.length > 0 && (
            <div className="mt-2 space-y-1">
              {result.upgradeSuggestions.map((s, j) => (
                <div key={j} className="flex items-start gap-1.5 text-xs text-[#00E676]">
                  <CheckCircleIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Link
              href={`/laptops/${result.laptop.slug}`}
              onClick={close}
              className="flex-1 rounded-lg bg-[var(--secondary)] py-2 text-center text-xs font-medium text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
            >
              View Details
            </Link>
            <WhatsAppButton laptop={result.laptop} />
          </div>
        </motion.div>
      ))}

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
        <Link
          href="/laptops"
          onClick={close}
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          Browse all laptops →
        </Link>
        <button
          onClick={startFresh}
          className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline underline-offset-2"
        >
          Start new search
        </button>
      </div>
    </div>
  )
}
