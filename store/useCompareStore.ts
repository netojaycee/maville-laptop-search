import { create } from 'zustand'

interface CompareStore {
  selectedIds: string[]
  canAdd: boolean
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  isSelected: (id: string) => boolean
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  selectedIds: [],
  canAdd: true,

  add: (id) =>
    set((s) => {
      if (s.selectedIds.length >= 3 || s.selectedIds.includes(id)) return s
      const next = [...s.selectedIds, id]
      return { selectedIds: next, canAdd: next.length < 3 }
    }),

  remove: (id) =>
    set((s) => {
      const next = s.selectedIds.filter((i) => i !== id)
      return { selectedIds: next, canAdd: next.length < 3 }
    }),

  clear: () => set({ selectedIds: [], canAdd: true }),

  isSelected: (id) => get().selectedIds.includes(id),
}))
