import { create } from 'zustand'
import { Laptop } from '@/types'

interface LaptopQuickViewStore {
  laptop: Laptop | null
  open: (laptop: Laptop) => void
  close: () => void
}

export const useLaptopQuickViewStore = create<LaptopQuickViewStore>((set) => ({
  laptop: null,
  open: (laptop) => set({ laptop }),
  close: () => set({ laptop: null }),
}))
