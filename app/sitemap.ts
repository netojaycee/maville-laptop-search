import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? 'https://mavilletech.vercel.app'

  const base_routes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/laptops`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ]

  try {
    const laptops = await prisma.laptop.findMany({
      where: { archived: false },
      select: { slug: true, updatedAt: true },
    })

    return [
      ...base_routes,
      ...laptops.map((l: { slug: string; updatedAt: Date }) => ({
        url: `${base}/laptops/${l.slug}`,
        lastModified: l.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      })),
    ]
  } catch {
    return base_routes
  }
}
