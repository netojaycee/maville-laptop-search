'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { useLaptopQuickViewStore } from '@/store/useLaptopQuickViewStore'
import { ScoredLaptop } from '@/types'
import { ScoreRing } from '@/components/laptops/ScoreRing'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { formatPrice } from '@/lib/utils'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'

// ── Best Match card (rank #1) — full-width hero treatment ──────────────────
function BestMatchCard({ result }: { result: ScoredLaptop }) {
  const openQuickView = useLaptopQuickViewStore((s) => s.open)
  const image = result.laptop.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border-2 border-[var(--primary)] bg-gradient-to-br from-[var(--card)] to-[var(--primary)]/5 shadow-[0_0_40px_rgba(0,212,255,0.15)]"
    >
      {/* Glow strip at top */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary)]/60 to-transparent" />

      <div className="p-5">
        {/* Badge row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-3 py-1">
            <TrophyIcon className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              1st Best Match
            </span>
          </div>
          <ScoreRing score={result.totalScore} size={64} strokeWidth={5} />
        </div>

        {/* Content */}
        <div className="flex gap-5">
          {/* Image */}
          <div className="relative h-32 w-40 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--secondary)] sm:h-40 sm:w-48">
            {image ? (
              <Image
                src={image}
                alt={`${result.laptop.brand} ${result.laptop.model}`}
                fill
                className="object-contain p-3"
                sizes="(max-width: 640px) 160px, 192px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl opacity-20">💻</div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col justify-between min-w-0">
            <div>
              <p className="text-xs font-medium text-[var(--primary)]">{result.laptop.brand}</p>
              <h3 className="mt-0.5 font-display text-xl font-bold text-[var(--foreground)] leading-tight">
                {result.laptop.model}
              </h3>
              <p className="mt-1 font-mono text-2xl font-bold text-[var(--foreground)]">
                ₦{formatPrice(result.laptop.price)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.bestFor.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-medium text-[var(--primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Warnings / upgrades */}
        {result.warnings.length > 0 && (
          <div className="mt-4 space-y-1">
            {result.warnings.slice(0, 2).map((w, j) => (
              <div key={j} className="flex items-start gap-1.5 text-xs text-[var(--brand-warning)]">
                <ExclamationTriangleIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}
        {result.upgradeSuggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            {result.upgradeSuggestions.slice(0, 1).map((s, j) => (
              <div key={j} className="flex items-start gap-1.5 text-xs text-[var(--brand-success)]">
                <CheckCircleIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => openQuickView(result.laptop)}
            className="flex-1 rounded-xl bg-[var(--primary)] py-2.5 text-center text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            View Details
          </button>
          <WhatsAppButton laptop={result.laptop} />
        </div>
      </div>
    </motion.div>
  )
}

// ── Runner-up card (ranks 2–5) — compact grid card ─────────────────────────
const RANK_LABELS: Record<number, string> = { 0: '2nd', 1: '3rd', 2: '4th', 3: '5th' }

function RunnerUpCard({ result, index }: { result: ScoredLaptop; index: number }) {
  const openQuickView = useLaptopQuickViewStore((s) => s.open)
  const image = result.laptop.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.07, ease: 'easeOut' }}
      className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
    >
      {/* Image */}
      <div className="relative h-32 w-full overflow-hidden bg-[var(--secondary)]">
        {image ? (
          <Image
            src={image}
            alt={`${result.laptop.brand} ${result.laptop.model}`}
            fill
            className="object-contain p-3"
            sizes="(max-width: 640px) 50vw, 300px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl opacity-20">💻</div>
        )}
        {/* Rank badge */}
        <span className="absolute left-3 top-3 rounded-full bg-[var(--background)]/80 px-2 py-0.5 text-[10px] font-bold text-[var(--muted-foreground)] backdrop-blur-sm">
          {RANK_LABELS[index] ?? `${index + 2}th`}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[var(--primary)]">{result.laptop.brand}</p>
            <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">{result.laptop.model}</h3>
            <p className="font-mono text-base font-bold text-[var(--foreground)]">
              ₦{formatPrice(result.laptop.price)}
            </p>
          </div>
          <ScoreRing score={result.totalScore} size={48} strokeWidth={4} showLabel={false} />
        </div>

        <div className="flex flex-wrap gap-1">
          {result.bestFor.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded bg-[var(--secondary)] px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">
              {tag}
            </span>
          ))}
        </div>

        {result.warnings.length > 0 && (
          <div className="flex items-start gap-1.5 text-[11px] text-[var(--brand-warning)]">
            <ExclamationTriangleIcon className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{result.warnings[0]}</span>
          </div>
        )}

        {/* Push CTAs to bottom */}
        <div className="mt-auto flex gap-2 pt-2">
          <button
            onClick={() => openQuickView(result.laptop)}
            className="flex-1 rounded-lg bg-[var(--secondary)] py-2 text-center text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--border)]"
          >
            View Details
          </button>
          <WhatsAppButton laptop={result.laptop} />
        </div>
      </div>
    </motion.div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export function ResultsReveal() {
  const { results, startFresh } = useRecommendationStore()

  if (!results.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="text-5xl">😕</div>
        <h3 className="text-xl font-bold text-[var(--foreground)]">No matches found</h3>
        <p className="text-[var(--muted-foreground)]">Try adjusting your budget or preferences</p>
        <button
          onClick={startFresh}
          className="mt-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    )
  }

  const [best, ...rest] = results

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-[var(--primary)]" />
          <div>
            <h2 className="font-display text-xl font-bold text-[var(--foreground)]">
              {results.length} match{results.length !== 1 ? 'es' : ''} found
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">Ranked by fit to your preferences</p>
          </div>
        </div>
        <button
          onClick={startFresh}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          New search
        </button>
      </div>

      {/* #1 Best Match — full width */}
      <BestMatchCard result={best} />

      {/* Runners-up — 2-col desktop, 1-col mobile */}
      {rest.length > 0 && (
        <>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Also worth considering
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rest.map((result, i) => (
              <RunnerUpCard key={result.laptop.id} result={result} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
