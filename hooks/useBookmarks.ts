'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'Maville Technologies_bookmarks'

export function useBookmarks() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setBookmarkIds(JSON.parse(stored))
    } catch {
      setBookmarkIds([])
    }
  }, [])

  const save = useCallback((ids: string[]) => {
    setBookmarkIds(ids)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {}
  }, [])

  const toggle = useCallback(
    (id: string) => {
      const next = bookmarkIds.includes(id)
        ? bookmarkIds.filter((b) => b !== id)
        : [...bookmarkIds, id]
      save(next)
    },
    [bookmarkIds, save]
  )

  const isBookmarked = useCallback((id: string) => bookmarkIds.includes(id), [bookmarkIds])

  const remove = useCallback(
    (id: string) => save(bookmarkIds.filter((b) => b !== id)),
    [bookmarkIds, save]
  )

  return { bookmarkIds, toggle, isBookmarked, remove, count: bookmarkIds.length }
}
