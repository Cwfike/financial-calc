import type { Metadata } from 'next'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Auto Loan Calculator",
  "description": "Calculate monthly auto loan payments with credit score-based interest rates for new and used vehicles",
  "url": "https://financial-calc.com/calculators/auto-loan",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Credit score-based interest rates",
    "New and used vehicle rate options",
    "Trade-in value calculator",
    "Multiple loan term options (2-7 years)",
    "Real-time payment calculations",
    "Down payment percentage calculator"
  ]
}

export const metadata: Metadata = {
  title: 'Auto Loan Calculator - Calculate Car Payments by Credit Score | Financial Calc',
  description: 'Free auto loan calculator with credit score-based interest rates. Calculate monthly car payments for new and used vehicles. Compare loan terms and see total interest costs.',
  keywords: [
    'auto loan calculator',
    'car payment calculator',
    'auto loan payment calculator',
    'car loan calculator by credit score',
    'monthly car payment',
    'auto financing calculator',
    'car interest rate calculator',
    'used car loan calculator',
    'new car loan calculator',
    'vehicle payment calculator'
  ],
  openGraph: {
    title: 'Auto Loan Calculator - Calculate Car Payments by Credit Score',
    description: 'Calculate monthly auto loan payments with credit-based interest rates. Compare new vs used vehicle rates and loan terms.',
    url: 'https://financial-calc.com/calculators/auto-loan',
    images: [
      {
        url: '/og-auto-loan.png',
        width: 1200,
        height: 630,
        alt: 'Auto Loan Calculator - Calculate Car Loan Payments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auto Loan Calculator - Car Payment Calculator',
    description: 'Calculate auto loan payments with credit-based rates. Free car loan calculator with new and used vehicle options.',
    images: ['/og-auto-loan.png'],
  },
  alternates: {
    canonical: 'https://financial-calc.com/calculators/auto-loan',
  },
}

export default function AutoLoanLayout({
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
