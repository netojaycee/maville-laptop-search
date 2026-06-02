import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { LaptopCard } from '@/components/laptops/LaptopCard'
import { HeroSceneClient } from '@/components/three/HeroSceneClient'
import { HeroContent } from '@/components/home/HeroContent'
import { HomeSections } from '@/components/home/HomeSections'
import { Laptop } from '@/types'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Maville Technologies — Find Your Perfect Laptop in Nigeria',
  description: 'AI-powered laptop recommendations for the Nigerian market. Compare specs, check prices, find your match.',
}

export const revalidate = 3600

async function getFeaturedLaptops(): Promise<Laptop[]> {
  try {
    return await prisma.laptop.findMany({
      where: { featured: true, archived: false, availability: { not: 'Out of Stock' } },
      take: 4,
      orderBy: { views: 'desc' },
    }) as unknown as Laptop[]
  } catch {
    return []
  }
}

async function getStats(): Promise<{ total: number; brandCount: number }> {
  try {
    const [total, brands] = await Promise.all([
      prisma.laptop.count({ where: { archived: false } }),
      prisma.laptop.findMany({ where: { archived: false }, select: { brand: true }, distinct: ['brand'] }),
    ])
    return { total, brandCount: brands.length }
  } catch {
    return { total: 0, brandCount: 0 }
  }
}

export default async function HomePage() {
  const [featured, stats] = await Promise.all([getFeaturedLaptops(), getStats()])

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────────
           Dark mode : near-black  (#080B11)
           Light mode: deep navy  (gradient from #06101E → #0E2040)
           The scene is always dark — cinematic — but visually distinct per theme.
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="hero-section relative flex min-h-[100svh] items-center overflow-hidden">
        {/* Theme-aware background painted by CSS (see globals.css) */}
        <div className="hero-bg absolute inset-0" />

        {/* Three.js particle scene */}
        <HeroSceneClient />

        {/* Radial vignette — gives depth, hides hard canvas edge */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <HeroContent total={stats.total} brandCount={stats.brandCount} />
        </div>

        {/* Bottom gradient — dissolves hero into page background */}
        <div
          className="hero-fade pointer-events-none absolute bottom-0 left-0 right-0 z-[2] h-40"
          aria-hidden
        />
      </section>

      {/* Below-hero sections — themed */}
      <HomeSections featured={featured} />
    </div>
  )
}
