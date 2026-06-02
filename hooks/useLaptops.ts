'use client'

import { useQuery } from '@tanstack/react-query'
import { LaptopFilters, PaginatedLaptops } from '@/types'

async function fetchLaptops(filters: LaptopFilters): Promise<PaginatedLaptops> {
  const params = new URLSearchParams()
  if (filters.brand?.length) params.set('brand', filters.brand.join(','))
  if (filters.priceMin !== undefined) params.set('priceMin', String(filters.priceMin))
  if (filters.priceMax !== undefined) params.set('priceMax', String(filters.priceMax))
  if (filters.ram?.length) params.set('ram', filters.ram.join(','))
  if (filters.useCase) params.set('useCase', filters.useCase)
  if (filters.condition?.length) params.set('condition', filters.condition.join(','))
  if (filters.features?.length) params.set('features', filters.features.join(','))
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))

  const res = await fetch(`/api/laptops?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch laptops')
  return res.json()
}

export function useLaptops(filters: LaptopFilters = {}) {
  return useQuery({
    queryKey: ['laptops', filters],
    queryFn: () => fetchLaptops(filters),
    staleTime: 5 * 60 * 1000,
  })
}
