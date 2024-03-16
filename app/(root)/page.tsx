import Link from 'next/link'
import type { Metadata } from 'next/types'

export interface Props { }

export const runtime = 'edge'

export const metadata = {
  metadataBase: new URL('https://luxass.dev/'),
  title: 'home | image.luxass.dev',
  description: 'open graph image generator for luxass.dev',
  keywords: [
    'lucas nørgård',
    'luxass',
    'nørgård',
    'lucas',
    'fullstack',
    'backend',
    'frontend',
    'web developer',
    'website',
    'Web',
    'open graph',
    'og',
  ],
  openGraph: {
    type: 'website',
    siteName: 'luxass.dev',
    url: 'https://luxass.dev/',
    title: 'home | image.luxass.dev',
    description: 'open graph image generator for luxass.dev',
    images: [
      {
        url: 'https://image.luxass.dev/api/image/text',
        width: 300,
        height: 300,
        alt: 'image.luxass.dev',
      },
    ],
  },
} satisfies Metadata

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Link href="https://luxass.dev">have a good day 🩵</Link>
    </main>
  )
}
