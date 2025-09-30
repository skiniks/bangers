import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Providers from './providers'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Bangers',
    default: 'Bangers - Find Your Best Bluesky Posts',
  },
  description: 'Discover your most engaging Bluesky posts, ranked by community engagement.',
  metadataBase: new URL('https://bangers.ryanskinner.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bangers.ryanskinner.com',
    title: 'Bangers - Find Your Best Bluesky Posts',
    description: 'Discover your most engaging Bluesky posts, ranked by community engagement.',
    siteName: 'Bangers',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e293b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
