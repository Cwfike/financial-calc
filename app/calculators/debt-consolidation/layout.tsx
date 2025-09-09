import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Debt Consolidation Calculator - Compare Loan Options',
  description: 'Calculate debt consolidation savings with our comprehensive calculator. Compare interest rates, monthly payments, and total costs. Get personalized consolidation loan rates based on your credit score.',
  keywords: [
    'debt consolidation calculator',
    'debt payoff calculator', 
    'consolidation loan calculator',
    'debt consolidation rates',
    'personal loan calculator',
    'debt relief calculator',
    'consolidate credit card debt',
    'debt payoff comparison',
    'loan consolidation calculator',
    'debt management calculator'
  ],
  openGraph: {
    title: 'Debt Consolidation Calculator - Compare Loan Options',
    description: 'Calculate debt consolidation savings with personalized rates. Compare before and after scenarios to find the best consolidation loan option.',
    type: 'website',
    url: 'https://financial-calc.com/calculators/debt-consolidation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debt Consolidation Calculator',
    description: 'Calculate debt consolidation savings with personalized rates and payment comparisons.',
  },
  alternates: {
    canonical: '/calculators/debt-consolidation',
  },
}

export default function DebtConsolidationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}