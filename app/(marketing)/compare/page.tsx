import { Suspense } from 'react'
import { CompareContent } from '@/components/laptops/CompareContent'

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin text-4xl">⚡</div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  )
}
