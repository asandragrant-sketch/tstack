import React from 'react'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import FiverrButton from '@/components/common/FiverrButton'

export const viewport: Viewport = {
  themeColor: '#070B14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tstackweb.com'),
  title: {
    default: 'TSTACK WEB | Modern Web Development & Digital Solutions',
    template: '%s | TSTACK WEB',
  },
  description:
    'TSTACK WEB is an international full-service web development and digital solutions agency serving the USA, UK, Spain, and Asia. Specializing in high-performance websites, e-commerce, and custom software.',
  keywords: [
    'Web development',
    'Website design',
    'Web development agency',
    'Website development',
    'E-commerce development',
    'UI/UX design',
    'Web applications',
    'WordPress development',
    'SEO services',
    'Website maintenance',
    'Custom software development',
    'TSTACK WEB',
    'Daniel Jacob',
  ],
  authors: [{ name: 'TSTACK WEB', url: 'https://tstackweb.com' }],
  creator: 'Daniel Jacob',
  publisher: 'TSTACK WEB',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tstackweb.com',
    siteName: 'TSTACK WEB',
    title: 'TSTACK WEB | Modern Web Development & Digital Solutions',
    description:
      'Full-service web development and digital solutions agency. Distinctive websites, custom software, and scalable digital experiences.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TSTACK WEB | Modern Web Development & Digital Solutions',
    description:
      'Full-service web development and digital solutions agency. Distinctive websites, custom software, and scalable digital experiences.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TSTACK WEB',
    url: 'https://tstackweb.com',
    logo: 'https://tstackweb.com/icon.svg',
    founder: {
      '@type': 'Person',
      name: 'Daniel Jacob',
      jobTitle: 'Founder & Lead Solutions Architect',
      image: 'https://tstackweb.com/images/founder-daniel-jacob.jpg',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'B.ELOWENWEBPRO@GMAIL.COM',
        contactType: 'customer service',
        availableLanguage: ['English', 'Spanish'],
      },
      {
        '@type': 'ContactPoint',
        email: 'D.JACOBWEBPRO@GMAIL.COM',
        contactType: 'technical support',
        availableLanguage: ['English', 'Spanish'],
      },
    ],
    areaServed: ['United States', 'United Kingdom', 'Spain', 'Asia'],
    description:
      'Full-service web development and digital solutions agency providing modern websites, UI/UX, and custom software.',
  }

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TSTACK WEB',
    url: 'https://tstackweb.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://tstackweb.com/services?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600/30 selection:text-white">
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <FiverrButton />
        <Footer />
      </body>
    </html>
  )
}
