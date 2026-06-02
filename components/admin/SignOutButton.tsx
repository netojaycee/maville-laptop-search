'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="mt-1 block text-xs text-[#FF6B35] hover:underline text-left"
    >
      Sign out
    </button>
  )
}
