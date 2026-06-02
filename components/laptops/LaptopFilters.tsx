'use client'

import { useState } from 'react'
import { LaptopFilters as FiltersType } from '@/types'
import { Slider } from '@/components/ui/slider'
import { formatPrice } from '@/lib/utils'

interface LaptopFiltersProps {
  brands: string[]
  filters?: FiltersType
  onChange?: (filters: FiltersType) => void
}

const CONDITIONS = ['New', 'Refurbished', 'Very Good', 'Used']
const RAM_OPTIONS = [4, 8, 16, 32, 64]
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export function LaptopFilters({ brands, filters = {}, onChange }: LaptopFiltersProps) {
  const [local, setLocal] = useState<FiltersType>(filters)

  const update = (patch: Partial<FiltersType>) => {
    const next = { ...local, ...patch }
    setLocal(next)
    onChange?.(next)
  }

  const toggleArr = (key: 'brand' | 'condition' | 'ram', val: string | number) => {
    const arr = (local[key] as unknown[]) ?? []
    const next = arr.includes(val as never) ? arr.filter((v) => v !== val) : [...arr, val]
    update({ [key]: next as never })
  }

  const activeCount = [
    local.brand?.length ?? 0,
    local.condition?.length ?? 0,
    local.ram?.length ?? 0,
    local.priceMin || local.priceMax ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const clear = () => { setLocal({}); onChange?.({}) }

  const labelClass = 'text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]'

  return (
    <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--foreground)]">Filters</h3>
        {activeCount > 0 && (
          <button onClick={clear} className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <p className={labelClass}>Sort by</p>
        <div className="flex flex-col gap-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ sort: opt.value as FiltersType['sort'] })}
              className={`rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                (local.sort ?? 'newest') === opt.value
                  ? 'bg-[var(--secondary)] text-[var(--primary)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <p className={labelClass}>Budget</p>
        <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
          <span>₦{formatPrice(local.priceMin ?? 0)}</span>
          <span>₦{formatPrice(local.priceMax ?? 2000000)}</span>
        </div>
        <Slider
          min={0}
          max={2000000}
          step={10000}
          value={[local.priceMin ?? 0, local.priceMax ?? 2000000]}
          onValueChange={(val) => {
            const vals = Array.isArray(val) ? val : [val]
            update({ priceMin: vals[0] ?? 0, priceMax: vals[1] ?? vals[0] ?? 0 })
          }}
        />
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="space-y-2">
          <p className={labelClass}>Brand</p>
          <div className="flex flex-wrap gap-1.5">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => toggleArr('brand', b)}
                className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                  local.brand?.includes(b)
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RAM */}
      <div className="space-y-2">
        <p className={labelClass}>RAM</p>
        <div className="flex flex-wrap gap-1.5">
          {RAM_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => toggleArr('ram', r)}
              className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors ${
                local.ram?.includes(r)
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {r}GB
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <p className={labelClass}>Condition</p>
        <div className="flex flex-col gap-1.5">
          {CONDITIONS.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={local.condition?.includes(c) ?? false}
                onChange={() => toggleArr('condition', c)}
                className="rounded accent-[var(--primary)]"
              />
              <span className="text-sm text-[var(--foreground)]">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
