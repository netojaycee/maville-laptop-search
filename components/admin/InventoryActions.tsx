'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Laptop } from '@/types'
import { toast } from 'sonner'

interface InventoryActionsProps {
  laptop: Laptop
}

export function InventoryActions({ laptop }: InventoryActionsProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  const handleArchive = async () => {
    if (!confirming) { setConfirming(true); return }
    const res = await fetch(`/api/laptops/${laptop.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Laptop archived')
      router.refresh()
    } else {
      toast.error('Failed to archive')
    }
    setConfirming(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/inventory/${laptop.id}`}
        className="rounded-lg bg-[#161B23] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1E2530] transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleArchive}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          confirming
            ? 'bg-[#FF6B35] text-white hover:bg-red-600'
            : 'bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20'
        }`}
      >
        {confirming ? 'Confirm?' : 'Archive'}
      </button>
    </div>
  )
}
