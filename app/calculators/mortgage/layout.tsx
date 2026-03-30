import type { Metadata } from 'next'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Mortgage Calculator",
  "description": "Calculate monthly mortgage payments with credit score-based interest rates for 15, 20, 25, and 30-year terms",
  "url": "https://financial-calc.com/calculators/mortgage",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Credit score-based interest rates",
    "Multiple loan term options (15, 20, 25, 30 years)",
    "Real-time payment calculations",
    "Total interest calculations",
    "Down payment percentage calculator"
  ]
}

export const metadata: Metadata = {
  title: 'Mortgage Calculator - Calculate Monthly Payments by Credit Score | Financial Calc',
  description: 'Free mortgage calculator with rates based on your credit score. See your real monthly payment instantly. Compare 15, 20, 25 & 30-year terms — no sign-up needed.',
  keywords: [
    'mortgage calculator',
    'home loan calculator',
    'mortgage payment calculator',
    'mortgage rates by credit score',
    'monthly mortgage payment',
    'home financing calculator',
    'mortgage interest calculator',
    '15 year mortgage',
    '30 year mortgage',
    'down payment calculator'
  ],
  openGraph: {
    title: 'Mortgage Calculator - Calculate Monthly Payments by Credit Score',
    description: 'Calculate monthly mortgage payments with credit-based interest rates. Compare loan terms and see total interest costs.',
    url: 'https://financial-calc.com/calculators/mortgage',
    images: [
      {
        url: '/og-mortgage.png',
        width: 1200,
        height: 630,
        alt: 'Mortgage Calculator - Calculate Home Loan Payments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator - Home Loan Payment Calculator',
    description: 'Calculate mortgage payments with credit-based rates. Free home loan calculator with multiple term options.',
    images: ['/og-mortgage.png'],
  },
  alternates: {
    canonical: 'https://financial-calc.com/calculators/mortgage',
  },
}

export default function MortgageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* JSON-LD rendered server-side so Googlebot sees it in raw HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  )
}