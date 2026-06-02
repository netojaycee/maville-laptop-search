'use client'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  }
}

export const analytics = {
  recommendationStarted: () => track('recommendation_started'),

  recommendationCompleted: (useCase: string, budget: number) =>
    track('recommendation_completed', { use_case: useCase, budget }),

  laptopViewed: (laptopId: string, brand: string, model: string) =>
    track('laptop_viewed', { laptop_id: laptopId, brand, model }),

  enquiryClicked: (laptopId: string) =>
    track('enquiry_clicked', { laptop_id: laptopId }),

  compareStarted: (laptopIds: string[]) =>
    track('compare_started', { laptop_ids: laptopIds.join(',') }),

  bookmarkAdded: (laptopId: string) =>
    track('bookmark_added', { laptop_id: laptopId }),

  bookmarkRemoved: (laptopId: string) =>
    track('bookmark_removed', { laptop_id: laptopId }),
}
