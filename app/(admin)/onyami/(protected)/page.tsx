import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import type { Laptop as LaptopType, QueryLog as QueryLogType } from '@/types'

async function getDashboardData() {
  const [total, totalViews, topViewed, recentQueries, lowStock] = await Promise.all([
    prisma.laptop.count({ where: { archived: false } }),
    prisma.laptop.aggregate({ where: { archived: false }, _sum: { views: true } }),
    prisma.laptop.findMany({
      where: { archived: false },
      orderBy: { views: 'desc' },
      take: 5,
    }),
    prisma.queryLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.laptop.count({
      where: { archived: false, availability: { in: ['Low Stock', 'Out of Stock'] } },
    }),
  ])

  return { total, totalViews: totalViews._sum.views ?? 0, topViewed, recentQueries, lowStock }
}

export default async function AdminDashboard() {
  const { total, totalViews, topViewed, recentQueries, lowStock } = await getDashboardData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-[#8B97A8]">Maville Technologies admin overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Laptops', value: total, color: 'text-[#00D4FF]' },
          { label: 'Total Views', value: totalViews.toLocaleString(), color: 'text-[#00E676]' },
          { label: 'Low/Out of Stock', value: lowStock, color: 'text-[#FFB300]' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-5">
            <p className="text-sm text-[#8B97A8]">{stat.label}</p>
            <p className={`mt-1 font-mono text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
        <Link
          href="/onyami/inventory/new"
          className="flex items-center justify-center rounded-xl border border-dashed border-[#1E2530] bg-[#0F1318] p-5 text-sm text-[#00D4FF] hover:border-[#00D4FF] hover:bg-[#00D4FF]/5 transition-colors"
        >
          + Add New Laptop
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top viewed */}
        <div className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-5">
          <h2 className="mb-4 font-semibold text-white">Top 5 Most Viewed</h2>
          <div className="space-y-3">
            {(topViewed as unknown as LaptopType[]).map((laptop, i) => (
              <div key={laptop.id} className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-[#8B97A8]">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-white">{laptop.brand} {laptop.model}</p>
                  <p className="font-mono text-xs text-[#8B97A8]">₦{formatPrice(laptop.price)}</p>
                </div>
                <span className="font-mono text-sm text-[#00D4FF]">{laptop.views} views</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent queries */}
        <div className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-5">
          <h2 className="mb-4 font-semibold text-white">Recent Recommendation Queries</h2>
          <div className="space-y-2">
            {(recentQueries as unknown as QueryLogType[]).map((q) => (
              <div key={q.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="capitalize text-white">{q.useCase}</span>
                  <span className="ml-2 text-[#8B97A8]">
                    ₦{formatPrice(q.budgetMin)}–₦{formatPrice(q.budgetMax)}
                  </span>
                </div>
                <span className="text-[#00D4FF]">{q.resultCount} results</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
