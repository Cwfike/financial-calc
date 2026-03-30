import type { Metadata } from 'next'

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Retirement Calculator",
  "description": "Project your retirement savings with personalized estimates based on your age, contributions, and how your credit score affects your available monthly savings.",
  "url": "https://financial-calc.com/calculators/retirement",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Retirement savings projection",
    "Estimated monthly retirement income (4% rule)",
    "Total contributions vs. investment growth breakdown",
    "Credit score impact on retirement savings potential",
    "Conservative, moderate, and aggressive return scenarios"
  ]
}

export const metadata: Metadata = {
  title: 'Retirement Calculator - Project Your Savings & Monthly Income | Financial Calc',
  description: 'Free retirement calculator — project your savings, monthly income, and years to retirement. See how reducing debt frees up more to invest. Try it free.',
  keywords: [
    'retirement calculator',
    'retirement savings calculator',
    'retirement planning calculator',
    'how much to retire calculator',
    'retirement income calculator',
    '401k calculator',
    'retirement projection calculator',
    'how much do I need to retire',
    'retirement savings by age',
    'compound interest retirement calculator'
  ],
  openGraph: {
    title: 'Retirement Calculator - Project Your Savings & Monthly Income',
    description: 'Project your retirement savings and estimated monthly income. See how your credit score and debt affect how much you can save.',
    url: 'https://financial-calc.com/calculators/retirement',
    images: [
      {
        url: '/og-retirement.png',
        width: 1200,
        height: 630,
        alt: 'Retirement Calculator - Project Your Savings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement Calculator - Project Your Savings & Income',
    description: 'Free retirement calculator. Project savings, monthly income, and see how debt reduction boosts your retirement.',
    images: ['/og-retirement.png'],
  },
  alternates: {
    canonical: 'https://financial-calc.com/calculators/retirement',
  },
}

export default function RetirementLayout({
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
