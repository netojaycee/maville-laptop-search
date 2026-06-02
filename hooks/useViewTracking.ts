'use client'

import { useEffect } from 'react'

export function useViewTracking(laptopId: string) {
  useEffect(() => {
    const key = `viewed_${laptopId}`
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(key)) return

    fetch(`/api/laptops/${laptopId}/view`, { method: 'POST' })
      .then(() => sessionStorage.setItem(key, '1'))
      .catch(() => {})
  }, [laptopId])
}
