'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Laptop } from '@/types'
import { formatPrice, formatWeight } from '@/lib/utils'
import { WhatsAppButton } from '@/components/shared/WhatsAppButton'
import { ScoreRing } from '@/components/laptops/ScoreRing'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

async function fetchCompare(ids: string[]): Promise<{ laptops: Laptop[] }> {
  const res = await fetch('/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
  return res.json()
}

const SPEC_ROWS = [
  { label: 'Brand', key: 'brand', type: 'text' },
  { label: 'Model', key: 'model', type: 'text' },
  { label: 'Price', key: 'price', type: 'price' },
  { label: 'CPU', key: 'cpuName', type: 'text' },
  { label: 'RAM', key: 'ram', type: 'ram' },
  { label: 'Storage', key: 'storage', type: 'text' },
  { label: 'GPU', key: 'gpu', type: 'text' },
  { label: 'Weight', key: 'weight', type: 'weight' },
  { label: 'Battery', key: 'estimatedBatteryHours', type: 'hours' },
  { label: 'Condition', key: 'condition', type: 'text' },
  { label: 'Touchscreen', key: 'touchscreen', type: 'bool' },
  { label: 'Backlit KB', key: 'backlitKeyboard', type: 'bool' },
  { label: 'Fingerprint', key: 'fingerprintReader', type: 'bool' },
  { label: 'RAM Upgradeable', key: 'ramUpgradeable', type: 'bool' },
]

function formatVal(val: unknown, type: string) {
  if (val === null || val === undefined) return '—'
  switch (type) {
    case 'price': return `₦${formatPrice(val as number)}`
    case 'ram': return `${val}GB`
    case 'weight': return formatWeight(val as number)
    case 'hours': return `~${val}h`
    case 'bool': return val ? '✓' : '✗'
    default: return String(val)
  }
}

function getBetter(vals: unknown[], type: string): number[] {
  if (type === 'price') {
    const nums = vals.filter((v): v is number => typeof v === 'number')
    if (!nums.length) return []
    const min = Math.min(...nums)
    return vals.map((v, i) => (v === min ? i : -1)).filter((i) => i >= 0)
  }
  if (type === 'ram' || type === 'hours') {
    const nums = vals.filter((v): v is number => typeof v === 'number')
    if (!nums.length) return []
    const max = Math.max(...nums)
    return vals.map((v, i) => (v === max ? i : -1)).filter((i) => i >= 0)
  }
  return []
}

export function CompareContent() {
  const params = useSearchParams()
  const ids = params.get('ids')?.split(',').filter(Boolean) ?? []

  const { data, isLoading } = useQuery({
    queryKey: ['compare', ids],
    queryFn: () => fetchCompare(ids),
    enabled: ids.length >= 2,
  })

  const laptops = data?.laptops ?? []

  if (!ids.length || ids.length < 2) {
    return (
      <div className="flex flex-col items-center gap-4 py-32 text-center">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Select laptops to compare</h2>
        <p className="text-[var(--muted-foreground)]">Add 2–3 laptops from the browse page then hit Compare Now</p>
        <Link href="/laptops" className="rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary-foreground)]">
          Browse Laptops
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin text-4xl">⚡</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-4xl font-bold text-[var(--foreground)]">Compare Laptops</h1>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card)]">
              <th className="w-36 p-4 text-left text-sm font-medium text-[var(--muted-foreground)]">Spec</th>
              {laptops.map((l, i) => (
                <motion.th
                  key={l.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="min-w-[200px] p-4 text-left"
                >
                  <p className="text-xs font-medium text-[var(--primary)]">{l.brand}</p>
                  <p className="font-semibold text-[var(--foreground)]">{l.model}</p>
                  <p className="font-mono text-sm font-bold text-[var(--foreground)]">₦{formatPrice(l.price)}</p>
                  {l.programmingScore !== null && l.programmingScore !== undefined && (
                    <div className="mt-2">
                      <ScoreRing score={l.programmingScore} size={48} strokeWidth={4} showLabel={false} />
                    </div>
                  )}
                  <div className="mt-3">
                    <WhatsAppButton laptop={l} />
                  </div>
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[var(--background)]">
            {SPEC_ROWS.map(({ label, key, type }, rowIdx) => {
              const vals = laptops.map((l) => (l as unknown as Record<string, unknown>)[key])
              const betterIdxs = getBetter(vals, type)

              return (
                <tr key={key} className={`border-b border-[var(--border)] ${rowIdx % 2 === 0 ? 'bg-[var(--card)]/40' : ''}`}>
                  <td className="p-4 text-sm font-medium text-[var(--muted-foreground)]">{label}</td>
                  {vals.map((val, i) => {
                    const isBetter = betterIdxs.includes(i)
                    const isWorse = betterIdxs.length > 0 && !isBetter && val !== null && val !== undefined

                    return (
                      <td
                        key={i}
                        className={`p-4 font-mono text-sm ${
                          isBetter ? 'text-[#00E676] font-semibold' : isWorse ? 'text-[#FFB300]' : 'text-[var(--foreground)]'
                        }`}
                      >
                        {type === 'bool' ? (
                          val ? (
                            <CheckIcon className="h-4 w-4 text-[#00E676]" />
                          ) : (
                            <XMarkIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
                          )
                        ) : (
                          formatVal(val, type)
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
