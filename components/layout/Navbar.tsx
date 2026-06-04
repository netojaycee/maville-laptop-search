'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useBookmarks } from '@/hooks/useBookmarks'
import { useCompareStore } from '@/store/useCompareStore'
import { useRecommendationStore } from '@/store/useRecommendationStore'
import {
  BookmarkIcon,
  ArrowsRightLeftIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const [open, setOpen]       = useState(false)
  const [mounted, setMounted] = useState(false)

  const { count: bookmarkCount }  = useBookmarks()
  const { selectedIds }           = useCompareStore()
  const matchCount                = useRecommendationStore((s) => s.results.length)

  // Avoid hydration mismatch — sessionStorage isn't available on the server
  useEffect(() => setMounted(true), [])

  const navLinks = [
    { href: '/laptops', label: 'Browse' },
    { href: '/compare',  label: 'Compare' },
    { href: '/saved',    label: 'Saved' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-[var(--foreground)]">
            Maville<span className="text-[var(--primary)]">Technologies</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Icon row */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Matches indicator — only shown after mount when results exist */}
          {mounted && matchCount > 0 && (
            <Link
              href="/results"
              className="relative flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
              aria-label={`View ${matchCount} laptop matches`}
            >
              <SparklesIcon className="h-4 w-4" />
              <span className="hidden text-xs font-semibold sm:inline">My Matches</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-[var(--primary-foreground)]">
                {matchCount}
              </span>
            </Link>
          )}

          <Link
            href="/compare"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            aria-label="Compare laptops"
          >
            <ArrowsRightLeftIcon className="h-5 w-5" />
            {selectedIds.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-[var(--primary-foreground)]">
                {selectedIds.length}
              </span>
            )}
          </Link>

          <Link
            href="/saved"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            aria-label="Saved laptops"
          >
            <BookmarkIcon className="h-5 w-5" />
            {bookmarkCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B35] text-[10px] font-bold text-white">
                {bookmarkCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--background)] px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {mounted && matchCount > 0 && (
            <Link
              href="/results"
              className="flex items-center gap-2 py-2 text-sm font-medium text-[var(--primary)]"
              onClick={() => setOpen(false)}
            >
              <SparklesIcon className="h-4 w-4" />
              My Matches ({matchCount})
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
