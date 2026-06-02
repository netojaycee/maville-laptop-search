'use client'

import { useState } from 'react'
import { LaptopFilters as FiltersType, PaginatedLaptops } from '@/types'
import { LaptopFilters } from './LaptopFilters'
import { LaptopGrid } from './LaptopGrid'

interface BrowseLaptopsClientProps {
  initialData: PaginatedLaptops
  brands: string[]
}

export function BrowseLaptopsClient({ initialData, brands }: BrowseLaptopsClientProps) {
  const [filters, setFilters] = useState<FiltersType>({})
  const [page, setPage] = useState(1)

  const handleFilterChange = (f: FiltersType) => {
    setFilters(f)
    setPage(1)
  }

  return (
    <div className="flex gap-8">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <LaptopFilters brands={brands} filters={filters} onChange={handleFilterChange} />
      </aside>

      {/* Grid + mobile filters inside */}
      <div className="flex-1 min-w-0">
        {/* Mobile filter bar */}
        <div className="mb-4 lg:hidden">
          <LaptopFilters brands={brands} filters={filters} onChange={handleFilterChange} />
        </div>
        <LaptopGrid
          initialData={initialData}
          filters={filters}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
