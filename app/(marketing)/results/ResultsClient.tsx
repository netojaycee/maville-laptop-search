'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import { ResultsReveal } from '@/components/recommendation/ResultsReveal'
import { SparklesIcon } from '@heroicons/react/24/outline'

export function ResultsClient() {
  const [mounted, setMounted] = useState(false)
  const { results, startFresh } = useRecommendationStore()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="text-4xl animate-pulse">💻</div>
      </div>
    )
  }

  if (!results.length) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--secondary)]">
          <SparklesIcon className="h-10 w-10 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">No results yet</h1>
          <p className="mt-2 text-[var(--muted-foreground)]">
            Take the quiz to get personalised laptop recommendations
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={startFresh}
            className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            Find My Laptop →
          </button>
          <Link
            href="/laptops"
            className="rounded-xl border border-[var(--border)] px-6 py-3 font-medium text-[var(--muted-foreground)] transition-colors hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Browse all
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/20">
          <SparklesIcon className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">Your Matches</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Personalised just for you</p>
        </div>
      </div>

      <ResultsReveal />

      <div className="mt-8 border-t border-[var(--border)] pt-6">
        <Link
          href="/laptops"
          className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
        >
          Browse all laptops →
        </Link>
      </div>
    </div>
  )
}
