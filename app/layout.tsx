import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Financial Calc - Smart Mortgage & Auto Loan Calculators',
    template: '%s | Financial Calc'
  },
  description: 'Calculate mortgage and auto loan payments with personalized interest rates based on your credit score. Free, accurate financial calculators with real-time results.',
  keywords: [
    'mortgage calculator',
    'auto loan calculator',
    'car loan calculator',
    'loan payment calculator',
    'interest rate calculator',
    'credit score mortgage rates',
    'monthly payment calculator',
    'home loan calculator',
    'vehicle financing calculator'
  ],
  authors: [{ name: 'Financial Calc' }],
  creator: 'Financial Calc',
  publisher: 'Financial Calc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://financial-calc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://financial-calc.com',
    siteName: 'Financial Calc',
    title: 'Financial Calc - Smart Mortgage & Auto Loan Calculators',
    description: 'Calculate mortgage and auto loan payments with personalized interest rates based on your credit score. Free, accurate financial calculators.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Financial Calc - Mortgage and Auto Loan Calculators',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Calc - Smart Loan Calculators',
    description: 'Calculate loan payments with credit-based interest rates. Free mortgage and auto loan calculators.',
    images: ['/og-image.png'],
  },
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
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />  {/* 👈 Insert here */}
      </body>
    </html>
  )
}