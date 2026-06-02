import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'https://mavilletech.vercel.app'),
  title: {
    template: '%s | Maville Technologies',
    default: 'Maville Technologies — Find Your Perfect Laptop in Nigeria',
  },
  description: 'Discover and compare laptops for the Nigerian market. Get AI-powered recommendations based on your budget, use case, and needs.',
  keywords: ['laptop', 'buy laptop nigeria', 'laptop recommendation', 'laptop comparison', 'refurbished laptop'],
  authors: [{ name: 'John Edeh', url: 'https://johnedeh.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Maville Technologies',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500,400&f[]=satoshi@700,500,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        style={{
          fontFamily: 'var(--font-body, Satoshi, sans-serif)',
        }}
      >
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
            <Analytics />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
