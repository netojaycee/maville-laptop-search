'use client'

import { useBookmarks } from '@/hooks/useBookmarks'
import { useQuery } from '@tanstack/react-query'
import { LaptopCard } from '@/components/laptops/LaptopCard'
import { Laptop } from '@/types'
import Link from 'next/link'

async function fetchByIds(ids: string[]): Promise<{ laptops: Laptop[] }> {
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
  return res.json()
}

export default function SavedPage() {
  const { bookmarkIds } = useBookmarks()

  const { data, isLoading } = useQuery({
    queryKey: ['saved', bookmarkIds],
    queryFn: () => fetchByIds(bookmarkIds),
    enabled: bookmarkIds.length > 0,
  })

  const laptops = data?.laptops ?? []

  if (bookmarkIds.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-32 text-center">
        <div className="text-7xl">🔖</div>
        <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">No saved laptops yet</h2>
        <p className="text-[var(--muted-foreground)]">
          Browse laptops and click the bookmark icon to save them here for later.
        </p>
        <Link
          href="/laptops"
          className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        >
          Browse Laptops
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-display mb-8 text-4xl font-bold text-[var(--foreground)]">Saved Laptops</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarkIds.map((id) => (
            <div key={id} className="h-80 animate-pulse rounded-2xl bg-[var(--card)]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">Saved Laptops</h1>
        <span className="text-sm text-[var(--muted-foreground)]">{laptops.length} saved</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {laptops.map((laptop, i) => (
          <LaptopCard key={laptop.id} laptop={laptop} delay={i * 0.06} />
        ))}
      </div>
    </div>
  )
}
