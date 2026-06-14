import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/onyami/', '/api/'],
    },
    sitemap: 'https://mavilletech.vercel.app/sitemap.xml',
  }
}
