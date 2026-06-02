'use client'

import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

export function HeroSceneClient() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Don't render until mounted so theme is known (avoids hydration flash)
  if (!mounted) return <div className="absolute inset-0" />

  return <HeroScene isLight={theme === 'light'} />
}
