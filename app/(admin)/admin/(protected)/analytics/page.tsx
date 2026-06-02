import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

async function getAnalyticsData() {
  const [queryLogs, topViewed] = await Promise.all([
    prisma.queryLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.laptop.findMany({
      where: { archived: false },
      orderBy: { views: 'desc' },
      take: 10,
    }),
  ])

  const useCaseCounts = queryLogs.reduce<Record<string, number>>((acc, q) => {
    acc[q.useCase] = (acc[q.useCase] ?? 0) + 1
    return acc
  }, {})

  const budgetRanges = [
    { label: 'Under ₦150k', min: 0, max: 150000 },
    { label: '₦150k–300k', min: 150000, max: 300000 },
    { label: '₦300k–500k', min: 300000, max: 500000 },
    { label: 'Over ₦500k', min: 500000, max: Infinity },
  ].map((range) => ({
    ...range,
    count: queryLogs.filter((q) => q.budgetMax >= range.min && q.budgetMax < range.max).length,
  }))

  return { queryLogs, topViewed, useCaseCounts, budgetRanges }
}

export default async function AnalyticsPage() {
  const { queryLogs, topViewed, useCaseCounts, budgetRanges } = await getAnalyticsData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-[#8B97A8]">{queryLogs.length} total recommendation queries</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Use cases */}
        <div className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-5">
          <h2 className="mb-4 font-semibold text-white">Popular Use Cases</h2>
          <div className="space-y-2">
            {Object.entries(useCaseCounts)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([useCase, count]) => (
                <div key={useCase} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-[#8B97A8]">{useCase}</span>
                  <span className="font-mono text-[#00D4FF]">{String(count)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Budget ranges */}
        <div className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-5">
          <h2 className="mb-4 font-semibold text-white">Budget Ranges</h2>
          <div className="space-y-2">
            {budgetRanges.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="text-[#8B97A8]">{r.label}</span>
                <span className="font-mono text-[#00D4FF]">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top viewed */}
        <div className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-5">
          <h2 className="mb-4 font-semibold text-white">Most Viewed Laptops</h2>
          <div className="space-y-2">
            {topViewed.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-[#8B97A8]">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="truncate text-white">{l.brand} {l.model}</span>
                  <span className="ml-2 font-mono text-xs text-[#8B97A8]">₦{formatPrice(l.price)}</span>
                </div>
                <span className="font-mono text-[#00D4FF]">{l.views}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Query log */}
        <div className="rounded-xl border border-[#1E2530] bg-[#0F1318] p-5">
          <h2 className="mb-4 font-semibold text-white">Recent Queries</h2>
          <div className="space-y-2 overflow-y-auto max-h-64">
            {queryLogs.slice(0, 20).map((q) => (
              <div key={q.id} className="flex items-center justify-between text-xs text-[#8B97A8]">
                <span className="capitalize">{q.useCase}</span>
                <span>₦{formatPrice(q.budgetMin)}–₦{formatPrice(q.budgetMax)}</span>
                <span className="text-[#00D4FF]">{q.resultCount} results</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
