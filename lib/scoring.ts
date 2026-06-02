import { Laptop, UserPreferences, ScoredLaptop, ScoreBreakdown } from '@/types'

function calculatePerformance(laptop: Laptop, useCase: string): number {
  const useCaseScoreMap: Record<string, keyof Pick<Laptop, 'gamingScore' | 'editingScore' | 'programmingScore' | 'batteryScore'>> = {
    gaming: 'gamingScore',
    editing: 'editingScore',
    programming: 'programmingScore',
    school: 'batteryScore',
    office: 'programmingScore',
    design: 'editingScore',
  }

  const scoreField = useCaseScoreMap[useCase]

  if (useCase === 'general') {
    const scores = [laptop.gamingScore, laptop.editingScore, laptop.programmingScore, laptop.batteryScore].filter(Boolean) as number[]
    if (scores.length === 0) return estimatePerformanceFromSpecs(laptop)
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    return Math.round((avg / 100) * 30)
  }

  if (scoreField && laptop[scoreField] != null) {
    return Math.round(((laptop[scoreField] as number) / 100) * 30)
  }

  return estimatePerformanceFromSpecs(laptop)
}

function estimatePerformanceFromSpecs(laptop: Laptop): number {
  let score = 15
  const gen = parseInt(laptop.cpuGeneration || '0')
  if (gen >= 12) score += 8
  else if (gen >= 10) score += 5
  else if (gen >= 8) score += 2
  if (laptop.ram >= 32) score += 5
  else if (laptop.ram >= 16) score += 3
  else if (laptop.ram >= 8) score += 1
  const gpu = laptop.gpu.toLowerCase()
  if (!gpu.includes('intel') && !gpu.includes('amd radeon') && !gpu.includes('uhd')) score += 4
  return Math.min(score, 30)
}

function calculateBudget(price: number, budgetMin: number, budgetMax: number): number {
  if (price > budgetMax * 1.10) return 0
  if (price > budgetMax * 1.00) return 5
  if (price >= budgetMax * 0.80) return 25
  if (price >= budgetMax * 0.60) return 18
  return 12
}

function calculateFeatures(laptop: Laptop, requiredFeatures: string[]): number {
  if (!requiredFeatures || requiredFeatures.length === 0) return 20

  const featureMap: Record<string, boolean> = {
    touchscreen: laptop.touchscreen,
    backlit_keyboard: laptop.backlitKeyboard,
    fingerprint_reader: laptop.fingerprintReader,
    charger_included: laptop.chargerIncluded,
    additional_ssd_slot: laptop.additionalSsdSlot,
    ram_upgradeable: laptop.ramUpgradeable,
  }

  const matched = requiredFeatures.filter((f) => featureMap[f] === true).length
  return Math.round((matched / requiredFeatures.length) * 20)
}

function calculateBattery(laptop: Laptop, performancePref: string): number {
  if (laptop.batteryScore != null) {
    const base = Math.round((laptop.batteryScore / 100) * 15)
    if (performancePref === 'battery') return Math.min(base + 3, 15)
    if (performancePref === 'maximum') return base
    return base
  }

  const hours = laptop.estimatedBatteryHours
  if (!hours) return 5
  if (hours >= 8) return 15
  if (hours >= 5) return 10
  return 5
}

function calculatePortability(weight: number | null, portability: string): number {
  if (portability === 'any') return 10
  if (!weight) return 5

  if (portability === 'lightweight') {
    if (weight <= 1.5) return 10
    if (weight <= 2.0) return 6
    return 2
  }

  if (portability === 'balanced') {
    if (weight <= 2.0) return 10
    if (weight <= 2.5) return 7
    return 4
  }

  return 10
}

function generateWarnings(laptop: Laptop, prefs: UserPreferences): string[] {
  const warnings: string[] = []
  const gpu = laptop.gpu.toLowerCase()
  const isIntegrated = gpu.includes('intel uhd') || gpu.includes('intel iris') || gpu.includes('intel hd')

  if (prefs.useCase === 'gaming') {
    if (isIntegrated) warnings.push('This laptop has integrated graphics — not ideal for gaming')
    if (prefs.budgetMax < 150000) warnings.push('Your budget may be very tight for a gaming laptop')
  }

  if (prefs.useCase === 'editing' || prefs.useCase === 'design') {
    if (laptop.ram < 16) warnings.push('16GB RAM is recommended for smooth video editing')
    if (isIntegrated) warnings.push('A dedicated GPU is recommended for video editing')
  }

  if (!laptop.ramUpgradeable && laptop.ram < 16) {
    warnings.push('RAM cannot be expanded — consider a higher RAM configuration')
  }

  if (laptop.estimatedBatteryHours != null && laptop.estimatedBatteryHours < 4) {
    warnings.push('Battery life may be limited')
  }

  if (!laptop.batteryHealth) {
    warnings.push('Battery condition not assessed')
  }

  if (prefs.portability === 'lightweight' && laptop.weight && laptop.weight > 2.5) {
    warnings.push('This device is heavier than your preference')
  }

  if (laptop.price > prefs.budgetMax) {
    warnings.push('This laptop is slightly over your budget')
  }

  return warnings
}

function generateUpgrades(laptop: Laptop, prefs: UserPreferences): string[] {
  const suggestions: string[] = []

  if (laptop.ram < 16 && laptop.ramUpgradeable && ['programming', 'editing', 'design'].includes(prefs.useCase)) {
    suggestions.push(`Consider upgrading to ${laptop.maxRam || 32}GB RAM for better performance`)
  }

  if (laptop.additionalSsdSlot) {
    suggestions.push('Has an additional SSD slot — you can expand storage later')
  }

  if (laptop.estimatedBatteryHours != null && laptop.estimatedBatteryHours < 4) {
    suggestions.push('Consider a battery health check or replacement')
  }

  return suggestions
}

function determineBestFor(laptop: Laptop): string[] {
  const bestFor: string[] = []

  if (laptop.gamingScore != null && laptop.gamingScore >= 70) bestFor.push('Gaming')
  if (laptop.editingScore != null && laptop.editingScore >= 70) bestFor.push('Video Editing')
  if (laptop.programmingScore != null && laptop.programmingScore >= 70) bestFor.push('Programming')
  if (laptop.batteryScore != null && laptop.batteryScore >= 70) bestFor.push('Long Battery Life')
  if (laptop.weight != null && laptop.weight <= 1.8) bestFor.push('Portability')
  if (laptop.price < 200000) bestFor.push('Budget Friendly')
  if (bestFor.length === 0) bestFor.push('General Use')

  return bestFor
}

export function scoreLaptop(laptop: Laptop, prefs: UserPreferences): ScoredLaptop | null {
  const budgetScore = calculateBudget(laptop.price, prefs.budgetMin, prefs.budgetMax)
  if (budgetScore === 0) return null

  if (prefs.condition && prefs.condition !== 'any' && laptop.condition !== prefs.condition) {
    return null
  }

  const performance = calculatePerformance(laptop, prefs.useCase)
  const budget = budgetScore
  const features = calculateFeatures(laptop, prefs.requiredFeatures)
  const battery = calculateBattery(laptop, prefs.performancePreference)
  const portability = calculatePortability(laptop.weight, prefs.portability)

  const totalScore = performance + budget + features + battery + portability

  const breakdown: ScoreBreakdown = { performance, budget, features, battery, portability }

  return {
    laptop,
    totalScore,
    breakdown,
    warnings: generateWarnings(laptop, prefs),
    upgradeSuggestions: generateUpgrades(laptop, prefs),
    bestFor: determineBestFor(laptop),
  }
}

export function scoreAll(laptops: Laptop[], prefs: UserPreferences): ScoredLaptop[] {
  const scored = laptops
    .filter((l) => !l.archived && l.availability !== 'Out of Stock')
    .map((l) => scoreLaptop(l, prefs))
    .filter((r): r is ScoredLaptop => r !== null)

  return scored.sort((a, b) => b.totalScore - a.totalScore).slice(0, 5)
}
