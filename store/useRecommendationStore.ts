import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { UserPreferences, ScoredLaptop } from '@/types'

interface RecommendationStore {
  // ── Persistent (sessionStorage) ──────────────────────────────────────────
  results:     ScoredLaptop[]
  preferences: Partial<UserPreferences>

  // ── Transient UI state (never persisted) ─────────────────────────────────
  isOpen:       boolean
  currentStep:  number
  totalSteps:   number
  isCalculating: boolean

  // ── Actions ───────────────────────────────────────────────────────────────
  /** Open the modal.
   *  - If results already exist → opens straight to results view.
   *  - If no results → opens at step 0 (fresh quiz). */
  open:        () => void

  /** Wipe results + prefs and open the quiz from step 0. */
  startFresh:  () => void

  /** Clear persisted results without opening the modal (widget × button). */
  clearResults: () => void

  close:          () => void
  nextStep:       () => void
  prevStep:       () => void
  setPreference:  <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  setResults:     (results: ScoredLaptop[]) => void
  setCalculating: (val: boolean) => void
  reset:          () => void
}

const defaultPreferences: Partial<UserPreferences> = {
  budgetMin:            50000,
  budgetMax:            300000,
  useCases:             [],
  performancePreference: 'balanced',
  portability:          'any',
  requiredFeatures:     [],
  condition:            'any',
}

export const useRecommendationStore = create<RecommendationStore>()(
  persist(
    (set, get) => ({
      // Persistent defaults
      results:      [],
      preferences:  { ...defaultPreferences },

      // Transient defaults
      isOpen:        false,
      currentStep:   0,
      totalSteps:    5,
      isCalculating: false,

      open: () => {
        // Go straight to results if they exist — no need to redo the quiz
        set({ isOpen: true, isCalculating: false })
      },

      startFresh: () => set({
        isOpen:        true,
        currentStep:   0,
        preferences:   { ...defaultPreferences },
        results:       [],
        isCalculating: false,
      }),

      clearResults: () => set({
        results:     [],
        preferences: { ...defaultPreferences },
        currentStep: 0,
      }),

      close: () => set({ isOpen: false }),

      reset: () => set({
        isOpen:        false,
        currentStep:   0,
        preferences:   { ...defaultPreferences },
        results:       [],
        isCalculating: false,
      }),

      nextStep: () =>
        set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps - 1) })),

      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      setPreference: (key, value) =>
        set((s) => ({ preferences: { ...s.preferences, [key]: value } })),

      setResults:     (results)      => set({ results }),
      setCalculating: (isCalculating) => set({ isCalculating }),
    }),
    {
      name: 'laptophive-recommendations',
      storage: createJSONStorage(() => sessionStorage),
      // Only save the data we want to survive navigation — NOT UI state
      partialize: (state) => ({
        results:     state.results,
        preferences: state.preferences,
      }),
    }
  )
)
