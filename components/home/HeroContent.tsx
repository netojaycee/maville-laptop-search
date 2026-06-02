'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { useRef } from 'react'
import { HeroTrigger } from './HeroTrigger'

interface HeroContentProps {
  total: number
  brandCount: number
}

// ─── Character-by-character headline ────────────────────────────────────────
function AnimatedHeadline() {
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.03 } },
  }
  const charVariants: Variants = {
    hidden: { opacity: 0, y: 28, rotateX: -40 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const renderWord = (word: string, accent = false, spaceAfter = true) => (
    <>
      {word.split('').map((ch, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={charVariants}
          className={`inline-block ${accent ? 'text-[var(--primary)]' : ''}`}
          style={{ perspective: 500 }}
        >
          {ch}
        </motion.span>
      ))}
      {spaceAfter && <span className="inline-block">&nbsp;</span>}
    </>
  )

  return (
    <motion.h1
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Desktop: single line with nowrap | Mobile: natural 2-line break at "Laptop"
      className="font-display mb-6 text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white"
    >
      {/* "Find Your Perfect" stays on line 1 on mobile too, "Laptop" breaks to line 2 on mobile */}
      <span className="block lg:inline">
        {renderWord('Find')}
        {renderWord('Your')}
        {renderWord('Perfect')}
      </span>
      {' '}
      <span className="block lg:inline">
        {renderWord('Laptop', false, false)}
      </span>
    </motion.h1>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function HeroContent({ total, brandCount }: HeroContentProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Scroll-driven parallax — content lifts up and fades as page scrolls
  const { scrollY } = useScroll()
  const y       = useTransform(scrollY, [0, 480], [0, -90])
  const opacity = useTransform(scrollY, [0, 380], [1, 0])

  return (
    <motion.div ref={sectionRef} style={{ y, opacity }} className="max-w-3xl">

      {/* Live inventory badge */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00E676]" />
          <span className="text-xs font-medium text-white/70">
            {total} laptops in stock · {brandCount} brands
          </span>
        </motion.div>
      )}

      {/* Animated headline */}
      <AnimatedHeadline />

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="mb-10 max-w-lg text-base sm:text-lg text-white/55 leading-relaxed"
      >
        AI-powered recommendations based on your budget and use case.
        New, refurbished &amp; used laptops across Nigeria.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="flex flex-wrap gap-3"
      >
        <HeroTrigger />
        <Link
          href="/laptops"
          className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/35 hover:bg-white/10"
        >
          Browse All Laptops
        </Link>
      </motion.div>

      {/* Scroll indicator — bounces and fades on scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.7 }}
        style={{ opacity: useTransform(scrollY, [0, 120], [1, 0]) }}
        className="mt-14 hidden sm:flex items-center gap-3 text-white/70"
      >
        {/* Mouse icon with animated dot */}
        <div className="relative flex h-9 w-5 items-start justify-center overflow-hidden rounded-full border-2 border-white/50 pt-1.5 shadow-[0_0_12px_rgba(255,255,255,0.15)]">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="h-2 w-0.5 rounded-full bg-white/90"
          />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          Scroll to explore
        </span>
      </motion.div>
    </motion.div>
  )
}
