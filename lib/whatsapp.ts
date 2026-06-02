import { Laptop } from '@/types'
import { formatPrice } from '@/lib/utils'

export function buildWhatsAppUrl(laptop: Laptop, pageUrl?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000'
  const specsLine = `${laptop.ram}GB RAM | ${laptop.storage} | ${laptop.gpu}`
  const priceLine = `Price: ₦${formatPrice(laptop.price)}`
  const conditionLine = `Condition: ${laptop.condition}`
  const urlLine = pageUrl ? `\nPage: ${pageUrl}` : ''

  const message = [
    `Hello! I'm interested in the ${laptop.brand} ${laptop.model}.`,
    '',
    specsLine,
    priceLine,
    conditionLine,
    urlLine,
    '',
    'Is this laptop still available?',
  ].join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
