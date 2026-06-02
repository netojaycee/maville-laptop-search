import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatWeight, getConditionColor, getAvailabilityColor } from '@/lib/utils'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { BookmarkButton } from '@/components/shared/BookmarkButton'
import { ScoreRing } from '@/components/laptops/ScoreRing'
import { ViewTracker } from '@/components/laptops/ViewTracker'
import { LaptopCard } from '@/components/laptops/LaptopCard'
import { Laptop } from '@/types'

export const revalidate = 1800
export const dynamicParams = true

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return []
  try {
    const laptops = await prisma.laptop.findMany({
      where: { archived: false },
      select: { slug: true },
    })
    return laptops.map((laptop) => ({ slug: laptop.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const laptop = await prisma.laptop.findUnique({ where: { slug } })
  if (!laptop) return { title: 'Laptop Not Found' }

  return {
    title: `${laptop.brand} ${laptop.model} — Buy in Nigeria | Maville Technologies`,
    description: `${laptop.brand} ${laptop.model} with ${laptop.ram}GB RAM, ${laptop.storage}, ${laptop.gpu}. ₦${formatPrice(laptop.price)}. ${laptop.condition} condition. Available in Nigeria.`,
    openGraph: {
      images: laptop.images.length > 0 ? [laptop.images[0]] : ['/og-default.png'],
    },
  }
}

export default async function LaptopDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const laptop = await prisma.laptop.findUnique({ where: { slug, archived: false } })
  if (!laptop) notFound()

  const related = await prisma.laptop.findMany({
    where: {
      archived: false,
      brand: laptop.brand,
      id: { not: laptop.id },
    },
    take: 4,
    orderBy: { views: 'desc' },
  })

  const pageUrl = `https://mavilletech.vercel.app/laptops/${laptop.slug}`

  const scores = [
    { label: 'Gaming', score: laptop.gamingScore },
    { label: 'Editing', score: laptop.editingScore },
    { label: 'Programming', score: laptop.programmingScore },
    { label: 'Battery', score: laptop.batteryScore },
  ].filter((s) => s.score !== null) as { label: string; score: number }[]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${laptop.brand} ${laptop.model}`,
    brand: { '@type': 'Brand', name: laptop.brand },
    description: `${laptop.ram}GB RAM, ${laptop.storage}, ${laptop.gpu}`,
    image: laptop.images[0] ?? undefined,
    offers: {
      '@type': 'Offer',
      price: laptop.price,
      priceCurrency: 'NGN',
      availability: laptop.availability === 'In Stock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker laptopId={laptop.id} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative h-80 overflow-hidden rounded-2xl bg-[var(--card)]">
              {laptop.images?.[0] ? (
                <Image
                  src={laptop.images[0]}
                  alt={`${laptop.brand} ${laptop.model}`}
                  fill
                  className="object-contain p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl opacity-20">💻</div>
              )}
            </div>
            {laptop.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {laptop.images.slice(1).map((img: string, i: number) => (
                  <div key={i} className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--card)]">
                    <Image src={img} alt={`Image ${i + 2}`} fill className="object-contain p-2" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-[var(--primary)]">{laptop.brand}</p>
              <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">{laptop.model}</h1>
              <div className="mt-2 flex items-center gap-3">
                <p className="font-mono text-3xl font-bold text-[var(--foreground)]">₦{formatPrice(laptop.price)}</p>
                <span className={`text-sm font-medium ${getConditionColor(laptop.condition)}`}>{laptop.condition}</span>
              </div>
              <p className={`mt-1 text-sm font-medium ${getAvailabilityColor(laptop.availability)}`}>
                {laptop.availability}
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Processor', value: laptop.cpuName },
                { label: 'RAM', value: `${laptop.ram}GB${laptop.ramUpgradeable ? ' (Upgradeable)' : ''}` },
                { label: 'Storage', value: laptop.storage },
                { label: 'GPU', value: laptop.gpu },
                { label: 'Battery', value: laptop.estimatedBatteryHours ? `~${laptop.estimatedBatteryHours}h` : laptop.batteryHealth ?? 'N/A' },
                { label: 'Weight', value: formatWeight(laptop.weight) },
              ].map((spec) => (
                <div key={spec.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                  <p className="text-xs text-[var(--muted-foreground)]">{spec.label}</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--foreground)]">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {laptop.touchscreen && <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">Touchscreen</span>}
              {laptop.backlitKeyboard && <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">Backlit Keyboard</span>}
              {laptop.fingerprintReader && <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">Fingerprint Reader</span>}
              {laptop.chargerIncluded && <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">Charger Included</span>}
            </div>

            {/* Score rings */}
            {scores.length > 0 && (
              <div className="flex gap-4">
                {scores.map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <ScoreRing score={s.score} size={64} showLabel={false} />
                    <span className="text-xs text-[var(--muted-foreground)]">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3">
              <WhatsAppButton laptop={laptop as unknown as Laptop} pageUrl={pageUrl} variant="detail" />
              <div className="flex gap-2">
                <BookmarkButton laptopId={laptop.id} />
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display mb-6 text-2xl font-bold text-[var(--foreground)]">Other {laptop.brand} laptops</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(related as unknown as Laptop[]).map((r, i) => (
                <LaptopCard key={r.id} laptop={r} delay={i * 0.06} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
