'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLaptopQuickViewStore } from '@/store/useLaptopQuickViewStore'
import { useBookmarks } from '@/hooks/useBookmarks'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { ScoreRing } from './ScoreRing'
import { formatPrice, getConditionColor, getAvailabilityColor } from '@/lib/utils'
import {
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'

export function LaptopDetailModal() {
  const { laptop, close } = useLaptopQuickViewStore()
  const { isBookmarked, toggle } = useBookmarks()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [close])

  useEffect(() => {
    document.body.style.overflow = laptop ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [laptop])

  const image = laptop?.images?.[0]
  const displayScore = laptop
    ? (laptop.programmingScore ?? laptop.gamingScore ?? laptop.editingScore ?? laptop.batteryScore ?? null)
    : null
  const bookmarked = laptop ? isBookmarked(laptop.id) : false

  const specs = laptop ? [
    { label: 'CPU',       value: laptop.cpuName || '—' },
    { label: 'RAM',       value: laptop.ram ? `${laptop.ram}GB` : '—' },
    { label: 'Storage',   value: laptop.storage || '—' },
    { label: 'GPU',       value: laptop.gpu || '—' },
    { label: 'Battery',   value: laptop.estimatedBatteryHours ? `~${laptop.estimatedBatteryHours}h` : laptop.batteryHealth || '—' },
    { label: 'Weight',    value: laptop.weight ? `${laptop.weight}kg` : '—' },
  ] : []

  const features = laptop ? [
    laptop.touchscreen        && 'Touchscreen',
    laptop.backlitKeyboard    && 'Backlit Keyboard',
    laptop.fingerprintReader  && 'Fingerprint',
    laptop.chargerIncluded    && 'Charger Included',
    laptop.ramUpgradeable     && 'RAM Upgradeable',
    laptop.additionalSsdSlot  && 'Extra SSD Slot',
  ].filter(Boolean) as string[] : []

  return (
    <AnimatePresence>
      {laptop && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 24, scale: 0.97  }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[61] mx-auto max-w-2xl overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl sm:inset-x-4 sm:bottom-auto sm:top-[5%] sm:rounded-3xl"
            style={{ maxHeight: '92vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle on mobile */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-[var(--border)]" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--primary)]">{laptop.brand}</p>
                <h2 className="font-display text-xl font-bold text-[var(--foreground)]">{laptop.model}</h2>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${getConditionColor(laptop.condition)}`}>
                    {laptop.condition}
                  </span>
                  <span className={`text-xs font-medium ${getAvailabilityColor(laptop.availability)}`}>
                    {laptop.availability}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggle(laptop.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  {bookmarked
                    ? <BookmarkSolid className="h-5 w-5 text-[var(--primary)]" />
                    : <BookmarkOutline className="h-5 w-5" />}
                </button>
                <button
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: 'calc(92vh - 100px)' }}>
              {/* Image + score */}
              <div className="mt-4 flex gap-4">
                <div className="relative h-36 w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-[var(--secondary)]">
                  {image ? (
                    <Image
                      src={image}
                      alt={`${laptop.brand} ${laptop.model}`}
                      fill
                      className="object-contain p-3"
                      sizes="176px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl opacity-20">💻</div>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-3">
                  <p className="font-mono text-3xl font-bold text-[var(--foreground)]">
                    ₦{formatPrice(laptop.price)}
                  </p>
                  {displayScore !== null && (
                    <ScoreRing score={displayScore} size={64} strokeWidth={5} />
                  )}
                </div>
              </div>

              {/* Specs grid */}
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {specs.map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-[var(--secondary)] p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">{label}</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--foreground)] truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {features.map((f) => (
                    <span key={f} className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted-foreground)]">
                      <CheckCircleIcon className="h-3.5 w-3.5 text-[var(--brand-success)]" />
                      {f}
                    </span>
                  ))}
                </div>
              )}

              {/* Scores breakdown */}
              {(laptop.gamingScore || laptop.editingScore || laptop.programmingScore || laptop.batteryScore) && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">Performance Scores</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { label: 'Gaming',      val: laptop.gamingScore },
                      { label: 'Editing',     val: laptop.editingScore },
                      { label: 'Programming', val: laptop.programmingScore },
                      { label: 'Battery',     val: laptop.batteryScore },
                    ].filter((s) => s.val != null).map(({ label, val }) => (
                      <div key={label} className="flex flex-col items-center gap-1 rounded-xl bg-[var(--secondary)] py-3">
                        <p className="text-[10px] text-[var(--muted-foreground)]">{label}</p>
                        <p className="font-mono text-lg font-bold text-[var(--foreground)]">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA row */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <WhatsAppButton laptop={laptop} variant="detail" className="sm:flex-1" />
                <Link
                  href={`/laptops/${laptop.slug}`}
                  onClick={close}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)] sm:px-6"
                >
                  Full page
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* Warning about battery if applicable */}
              {!laptop.batteryHealth && (
                <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-[var(--brand-warning)]/10 p-3 text-xs text-[var(--brand-warning)]">
                  <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  Battery condition not assessed
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
