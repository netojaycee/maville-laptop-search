'use client'

import { useViewTracking } from '@/hooks/useViewTracking'

export function ViewTracker({ laptopId }: { laptopId: string }) {
  useViewTracking(laptopId)
  return null
}
