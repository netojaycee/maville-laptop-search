'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Laptop } from '@/types'
import { formatPrice, getConditionColor, getAvailabilityColor } from '@/lib/utils'
import { ScoreRing } from './ScoreRing'
import { BookmarkButton } from '@/components/shared/BookmarkButton'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { useCompareStore } from '@/store/useCompareStore'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline'

interface LaptopCardProps {
  laptop: Laptop
  score?: number
  delay?: number
}

export function LaptopCard({ laptop, score, delay = 0 }: LaptopCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const { add, remove, isSelected, canAdd } = useCompareStore()
  const selected = isSelected(laptop.id)
  const displayScore = score ?? laptop.programmingScore ?? laptop.gamingScore ?? laptop.editingScore ?? null
  const image = laptop.images?.[0]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 10
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 10
    setTilt({ x, y })
  }

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    selected ? remove(laptop.id) : canAdd && add(laptop.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <div
        ref={cardRef}
        className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-[0_0_30px_rgba(0,212,255,0.08)]"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hovered ? 'transform 0.1s ease' : 'transform 0.4s ease',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false) }}
      >
        {/* Image */}
        <Link href={`/laptops/${laptop.slug}`} className="block">
          <div className="relative h-44 overflow-hidden rounded-t-2xl bg-[var(--secondary)]">
            {image ? (
              <Image
                src={image}
                alt={`${laptop.brand} ${laptop.model}`}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg viewBox="0 0 100 60" className="h-20 w-32 opacity-20 fill-current text-[var(--muted-foreground)]">
                  <rect x="5" y="5" width="90" height="55" rx="3" />
                  <rect x="10" y="10" width="80" height="40" rx="1" fill="currentColor" opacity="0.3" />
                  <rect x="35" y="55" width="30" height="4" rx="1" />
                </svg>
              </div>
            )}

            {/* Badges */}
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-[var(--background)]/80 ${getConditionColor(laptop.condition)}`}>
                {laptop.condition}
              </span>
              {laptop.featured && (
                <span className="rounded-md bg-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                  Featured
                </span>
              )}
            </div>

            {/* Compare button */}
            <button
              onClick={toggleCompare}
              className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-xs opacity-0 transition-all group-hover:opacity-100 ${
                selected
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--secondary)]/90 text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              } ${!canAdd && !selected ? 'cursor-not-allowed opacity-40' : ''}`}
              aria-label={selected ? 'Remove from compare' : 'Add to compare'}
            >
              <ArrowsRightLeftIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-[var(--primary)]">{laptop.brand}</p>
              <Link href={`/laptops/${laptop.slug}`}>
                <h3 className="truncate text-sm font-semibold text-[var(--foreground)] hover:text-[var(--primary)]">
                  {laptop.model}
                </h3>
              </Link>
            </div>
            <BookmarkButton laptopId={laptop.id} />
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-1">
            {[
              laptop.cpuName.split(' ').slice(0, 3).join(' '),
              `${laptop.ram}GB RAM`,
              laptop.storage,
              laptop.gpu.split(' ').slice(0, 3).join(' '),
            ].map((spec, i) => (
              <span key={i} className="truncate rounded bg-[var(--secondary)] px-2 py-1 font-mono text-[10px] text-[var(--muted-foreground)]">
                {spec}
              </span>
            ))}
          </div>

          {/* Price + Score */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-lg font-bold text-[var(--foreground)]">₦{formatPrice(laptop.price)}</p>
              <p className={`text-[10px] font-medium ${getAvailabilityColor(laptop.availability)}`}>
                {laptop.availability}
              </p>
            </div>
            {displayScore !== null && (
              <ScoreRing score={displayScore} size={52} strokeWidth={4} showLabel={false} />
            )}
          </div>

          {/* CTA */}
          <div className="flex gap-2 border-t border-[var(--border)] pt-3">
            <Link
              href={`/laptops/${laptop.slug}`}
              className="flex-1 rounded-lg bg-[var(--secondary)] py-2 text-center text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--border)]"
            >
              View Details
            </Link>
            <WhatsAppButton laptop={laptop} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
