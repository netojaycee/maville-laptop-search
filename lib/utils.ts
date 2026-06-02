import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import SlugifyLib from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return SlugifyLib(text, { lower: true, strict: true, trim: true })
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatWeight(weight: number | null): string {
  if (!weight) return 'N/A'
  return `${weight}kg`
}

export function formatRam(ram: number): string {
  return `${ram}GB RAM`
}

export function getConditionColor(condition: string): string {
  switch (condition.toLowerCase()) {
    case 'new': return 'text-[#00E676]'
    case 'very good': return 'text-[#00D4FF]'
    case 'refurbished': return 'text-[#FFB300]'
    case 'used': return 'text-[#8B97A8]'
    default: return 'text-[#8B97A8]'
  }
}

export function getAvailabilityColor(availability: string): string {
  switch (availability.toLowerCase()) {
    case 'in stock': return 'text-[#00E676]'
    case 'low stock': return 'text-[#FFB300]'
    case 'out of stock': return 'text-[#FF6B35]'
    default: return 'text-[#8B97A8]'
  }
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Very Good'
  if (score >= 55) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#00E676'
  if (score >= 70) return '#00D4FF'
  if (score >= 55) return '#FFB300'
  if (score >= 40) return '#FF6B35'
  return '#8B97A8'
}
