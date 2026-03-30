import type { Metadata } from 'next'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Credit Card Payoff Calculator",
  "description": "Calculate how long it takes to pay off credit card debt and total interest costs. Compare minimum vs fixed payment strategies.",
  "url": "https://financial-calc.com/calculators/credit-card",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Credit card payoff timeline calculator",
    "Minimum payment vs fixed payment comparison",
    "Total interest cost breakdown",
    "Monthly interest calculations",
    "Debt elimination strategy tool"
  ]
}

export const metadata: Metadata = {
  title: 'Credit Card Payoff Calculator - Calculate Debt Payoff Time & Interest | Financial Calc',
  description: 'Free credit card payoff calculator. See how long to pay off your debt and total interest. Compare minimum vs fixed payments — get your exact payoff date now.',
  keywords: [
    'credit card payoff calculator',
    'debt payoff calculator',
    'credit card debt calculator',
    'credit card payment calculator',
    'debt repayment calculator',
    'minimum payment calculator',
    'credit card interest calculator',
    'debt elimination calculator',
    'pay off credit card debt',
    'credit card balance calculator'
  ],
  openGraph: {
    title: 'Credit Card Payoff Calculator - Debt Elimination Tool',
    description: 'Calculate how long it takes to pay off credit card debt and total interest costs. Compare payment strategies to save money.',
    url: 'https://financial-calc.com/calculators/credit-card',
    images: [
      {
        url: '/og-credit-card.png',
        width: 1200,
        height: 630,
        alt: 'Credit Card Payoff Calculator - Debt Elimination Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credit Card Payoff Calculator - Debt Elimination Tool',
    description: 'Calculate credit card payoff time and interest costs. Free debt repayment calculator with payment strategies.',
    images: ['/og-credit-card.png'],
  },
  alternates: {
    canonical: 'https://financial-calc.com/calculators/credit-card',
  },
}

export default function CreditCardLayout({
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