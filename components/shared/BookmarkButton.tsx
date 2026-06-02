'use client'

import { motion } from 'framer-motion'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import { useBookmarks } from '@/hooks/useBookmarks'
import { analytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  laptopId: string
  className?: string
}

export function BookmarkButton({ laptopId, className }: BookmarkButtonProps) {
  const { toggle, isBookmarked } = useBookmarks()
  const saved = isBookmarked(laptopId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!saved) analytics.bookmarkAdded(laptopId)
    toggle(laptopId)
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.8 }}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        saved
          ? 'bg-[#FF6B35]/15 text-[#FF6B35]'
          : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
        className
      )}
      aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
    >
      <motion.div
        animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {saved ? <BookmarkSolid className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />}
      </motion.div>
    </motion.button>
  )
}
