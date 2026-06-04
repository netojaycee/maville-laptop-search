import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { BrowseLaptopsClient } from '@/components/laptops/BrowseLaptopsClient'
import { PaginatedLaptops } from '@/types'

export const metadata: Metadata = {
  title: 'Browse Laptops',
  description: 'Browse and filter our full inventory of laptops in Nigeria. New, refurbished, and used across all budgets.',
}

export const revalidate = 3600

const emptyData: PaginatedLaptops = { laptops: [], total: 0, page: 1, limit: 24, totalPages: 0 }

async function getInitialLaptops(): Promise<PaginatedLaptops> {
  try {
    const [laptops, total] = await Promise.all([
      prisma.laptop.findMany({ where: { archived: false }, take: 24, orderBy: { createdAt: 'desc' } }),
      prisma.laptop.count({ where: { archived: false } }),
    ])
    return { laptops: laptops as never, total, page: 1, limit: 24, totalPages: Math.ceil(total / 24) }
  } catch {
    return emptyData
  }
}

async function getBrands(): Promise<string[]> {
  try {
    const brands = await prisma.laptop.findMany({
      where: { archived: false },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    })
    return brands.map((b: { brand: string }) => b.brand)
  } catch {
    return []
  }
}

export default async function LaptopsPage() {
  const [initialData, brands] = await Promise.all([getInitialLaptops(), getBrands()])

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">Browse Laptops</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          {initialData.total > 0 ? `${initialData.total} laptops available` : 'Add your first laptop from the admin panel'}
        </p>
      </div>

      <BrowseLaptopsClient initialData={initialData} brands={brands} />
    </div>
  )
}
