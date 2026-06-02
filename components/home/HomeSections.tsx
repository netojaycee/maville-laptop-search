'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { LaptopCard } from '@/components/laptops/LaptopCard'
import { Laptop } from '@/types'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

const HOW_IT_WORKS = [
  { step: '01', icon: '🎯', title: 'Tell us your needs', desc: 'Answer 5 quick questions about your budget, use case, and preferences.' },
  { step: '02', icon: '⚡', title: 'We score every laptop', desc: 'Our engine analyses all laptops across 5 dimensions and ranks the best matches for you.' },
  { step: '03', icon: '✅', title: 'Pick yours & enquire', desc: 'View details, compare options, and contact us instantly on WhatsApp.' },
]

interface HomeSectionsProps {
  featured: Laptop[]
}

export function HomeSections({ featured }: HomeSectionsProps) {
  return (
    <>
      {/* How It Works */}
      <section className="border-y border-[var(--border)] bg-[var(--card)] py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="font-display mb-12 text-center text-3xl font-bold text-[var(--foreground)]">
              How Maville Technologies Works
            </h2>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.12}>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
                  <span className="font-mono text-xs font-bold text-[var(--primary)]">{item.step}</span>
                  <div className="mt-4 mb-3 text-4xl">{item.icon}</div>
                  <h3 className="mb-2 text-lg font-bold text-[var(--foreground)]">{item.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Laptops */}
      {featured.length > 0 && (
        <section className="py-20 bg-[var(--background)] transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <div className="mb-10 flex items-end justify-between">
                <h2 className="font-display text-3xl font-bold text-[var(--foreground)]">Featured Laptops</h2>
                <Link href="/laptops" className="text-sm text-[var(--primary)] hover:underline">
                  View all →
                </Link>
              </div>
            </FadeUp>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((laptop, i) => (
                <FadeUp key={laptop.id} delay={i * 0.09}>
                  <LaptopCard laptop={laptop} />
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
