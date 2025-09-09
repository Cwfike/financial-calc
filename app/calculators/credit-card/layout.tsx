import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Credit Card Payoff Calculator - Calculate Debt Payoff Time & Interest | Financial Calc',
  description: 'Free credit card payoff calculator. Calculate how long it takes to pay off credit card debt, total interest costs, and compare minimum vs fixed payment strategies.',
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
  return children
}