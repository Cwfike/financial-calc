import type { Metadata } from 'next'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Compound Interest Calculator",
  "description": "Calculate how your investments grow over time with compound interest. See future value, total contributions, and interest earned based on your initial deposit, monthly contributions, return rate, and time horizon.",
  "url": "https://financial-calc.com/calculators/compound-interest",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Compound interest and investment growth projection",
    "Future value with monthly contributions",
    "Total contributions vs. interest earned breakdown",
    "Adjustable return rate and time horizon",
    "Credit score impact on investing potential"
  ]
}

export const metadata: Metadata = {
  title: 'Compound Interest Calculator - Investment Growth Over Time | Financial Calc',
  description: 'Free compound interest calculator — see how your savings and investments grow over time with monthly contributions. Calculate future value and interest earned instantly.',
  keywords: [
    'compound interest calculator',
    'investment growth calculator',
    'compound interest formula calculator',
    'future value calculator',
    'investment calculator',
    'savings growth calculator',
    'monthly contribution calculator',
    'how much will my investment grow',
    'compounding calculator',
    'interest earned calculator'
  ],
  openGraph: {
    title: 'Compound Interest Calculator - Investment Growth Over Time',
    description: 'See how your investments grow with compound interest and monthly contributions. Calculate future value, contributions, and interest earned.',
    url: 'https://financial-calc.com/calculators/compound-interest',
    images: [
      {
        url: '/og-compound-interest.png',
        width: 1200,
        height: 630,
        alt: 'Compound Interest Calculator - Investment Growth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator - Investment Growth Over Time',
    description: 'Free compound interest calculator. See how your savings grow with monthly contributions and compounding returns.',
    images: ['/og-compound-interest.png'],
  },
  alternates: {
    canonical: 'https://financial-calc.com/calculators/compound-interest',
  },
}

export default function CompoundInterestLayout({
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
