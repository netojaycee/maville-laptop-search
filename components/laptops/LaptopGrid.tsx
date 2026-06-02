'use client'

import { Laptop, LaptopFilters, PaginatedLaptops } from '@/types'
import { useLaptops } from '@/hooks/useLaptops'
import { LaptopCard } from './LaptopCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface LaptopGridProps {
  initialData?: PaginatedLaptops
  filters?: LaptopFilters
  page?: number
  onPageChange?: (page: number) => void
}

export function LaptopGrid({ initialData, filters = {}, page = 1, onPageChange }: LaptopGridProps) {
  const { data, isLoading, isError, isFetching } = useLaptops({ ...filters, page })
  const result = data ?? initialData
  const hasActiveFilters = Object.keys(filters).length > 0

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <Skeleton className="mb-4 h-44 rounded-xl" />
            <Skeleton className="mb-2 h-3 w-20" />
            <Skeleton className="mb-4 h-5 w-40" />
            <div className="mb-4 grid grid-cols-2 gap-1">
              {Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-6" />)}
            </div>
            <Skeleton className="h-9" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="text-5xl">⚠️</div>
        <p className="text-lg font-semibold text-[var(--foreground)]">Failed to load laptops</p>
        <p className="text-sm text-[var(--muted-foreground)]">Check your connection and try again</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!result?.laptops?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="text-6xl">🔍</div>
        <h3 className="text-xl font-semibold text-[var(--foreground)]">No laptops found</h3>
        <p className="text-sm text-[var(--muted-foreground)]">
          {hasActiveFilters
            ? 'No laptops match the current filters. Try broadening your search.'
            : 'No laptops have been added to the inventory yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isFetching && (
        <p className="text-xs text-[var(--muted-foreground)] animate-pulse">Updating results…</p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={JSON.stringify(filters) + page}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {result.laptops.map((laptop: Laptop, i: number) => (
            <LaptopCard key={laptop.id} laptop={laptop} delay={i * 0.05} />
          ))}
        </motion.div>
      </AnimatePresence>

      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => onPageChange?.(page - 1)}
          >
            ← Previous
          </Button>
          <span className="text-sm text-[var(--muted-foreground)]">
            Page {page} of {result.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= result.totalPages || isFetching}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  )
}
