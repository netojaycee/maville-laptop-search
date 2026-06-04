export interface Laptop {
  id: string
  slug: string
  brand: string
  model: string
  cpuName: string
  cpuGeneration: string | null
  ram: number
  maxRam: number | null
  ramUpgradeable: boolean
  storage: string
  storageType: string | null
  additionalSsdSlot: boolean
  gpu: string
  batteryHealth: string | null
  estimatedBatteryHours: number | null
  weight: number | null
  touchscreen: boolean
  backlitKeyboard: boolean
  fingerprintReader: boolean
  chargerIncluded: boolean
  keyboardType: string | null
  condition: string
  price: number
  availability: string
  images: string[]
  gamingScore: number | null
  editingScore: number | null
  programmingScore: number | null
  batteryScore: number | null
  views: number
  featured: boolean
  archived: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Admin {
  id: string
  email: string
  password: string
  createdAt: Date | string
}

export interface QueryLog {
  id: string
  useCase: string
  budgetMin: number
  budgetMax: number
  resultCount: number
  createdAt: Date | string
}

export interface UserPreferences {
  budgetMin: number
  budgetMax: number
  useCases: string[]
  performancePreference: 'maximum' | 'balanced' | 'battery'
  portability: 'lightweight' | 'balanced' | 'any'
  requiredFeatures: string[]
  condition: string
}

export interface ScoreBreakdown {
  performance: number
  budget: number
  features: number
  battery: number
  portability: number
}

export interface ScoredLaptop {
  laptop: Laptop
  totalScore: number
  breakdown: ScoreBreakdown
  warnings: string[]
  upgradeSuggestions: string[]
  bestFor: string[]
}

export type LaptopCondition = 'New' | 'Refurbished' | 'Used' | 'Very Good'
export type LaptopAvailability = 'In Stock' | 'Low Stock' | 'Out of Stock'
export type UseCase = 'gaming' | 'editing' | 'programming' | 'school' | 'office' | 'general' | 'design'
export type PerformancePreference = 'maximum' | 'balanced' | 'battery'
export type PortabilityPreference = 'lightweight' | 'balanced' | 'any'

export interface LaptopFilters {
  brand?: string[]
  priceMin?: number
  priceMax?: number
  ram?: number[]
  useCase?: string
  condition?: string[]
  features?: string[]
  sort?: 'price_asc' | 'price_desc' | 'score_desc' | 'newest'
  page?: number
  limit?: number
}

export interface PaginatedLaptops {
  laptops: Laptop[]
  total: number
  page: number
  limit: number
  totalPages: number
}
