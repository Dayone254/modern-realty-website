import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ardhi.co.ke'),
  title: {
    default: 'Ardhi & Co. | Land, Homes and Luxury Property in Nairobi',
    template: '%s | Ardhi & Co.',
  },
  description:
    'Ardhi & Co. is a Nairobi land and property house. Explore verified homes, apartments and investment property across Kenya.',
  applicationName: 'Ardhi & Co.',
  openGraph: {
    type: 'website',
    siteName: 'Ardhi & Co.',
    locale: 'en_KE',
    title: 'Ardhi & Co. | Land, Homes and Luxury Property in Nairobi',
    description:
      'Ardhi & Co. is a Nairobi land and property house. Explore verified homes, apartments and investment property across Kenya.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Ardhi & Co. — land, homes and investment property in Nairobi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ardhi & Co. | Land, Homes and Luxury Property in Nairobi',
    description:
      'Ardhi & Co. is a Nairobi land and property house. Explore verified homes, apartments and investment property across Kenya.',
    images: ['/og.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F4F1E9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body className="bg-cream font-sans text-ink antialiased">{children}</body>
    </html>
  )
}
