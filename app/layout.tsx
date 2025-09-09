import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
  },
}

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Navigation from './components/Navigation'
import Breadcrumb from './components/Breadcrumb'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Financial Calc",
    "url": "https://financial-calc.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://financial-calc.com/logo.png",
      "width": 600,
      "height": 60
    },
    "description": "Free mortgage, auto loan, and credit card payoff calculators with credit-based interest rates",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://financial-calc.com"
    },
    "sameAs": [
      "https://financial-calc.com"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "areaServed": "US",
    "knowsAbout": [
      "Mortgage Calculations",
      "Auto Loan Calculations", 
      "Credit Card Payoff Calculations",
      "Interest Rate Calculations",
      "Credit Score Impact on Loans"
    ],
    "offers": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Mortgage Calculator",
          "description": "Calculate monthly mortgage payments with credit score-based interest rates"
        },
        "url": "https://financial-calc.com/calculators/mortgage",
        "price": "0",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Auto Loan Calculator",
          "description": "Calculate monthly auto loan payments for new and used vehicles"
        },
        "url": "https://financial-calc.com/calculators/auto-loan",
        "price": "0",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Credit Card Payoff Calculator", 
          "description": "Calculate credit card debt payoff time and total interest costs"
        },
        "url": "https://financial-calc.com/calculators/credit-card",
        "price": "0",
        "priceCurrency": "USD"
      }
    ]
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <meta name="fo-verify" content="78422bb1-0331-4940-af1e-b4cf69cdae29" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>
        
        <Navigation />
        <Breadcrumb />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
