import Link from 'next/link'
import { Calculator, Car, CreditCard, Home, TrendingUp, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Calculators - Mortgage, Auto Loan & Credit Card Tools | Financial Calc',
  description: 'Access all our free financial calculators in one place. Calculate mortgage payments, auto loans, credit card payoff, and more with personalized rates based on your credit score.',
  keywords: [
    'financial calculators',
    'mortgage calculator',
    'auto loan calculator',
    'credit card payoff calculator',
    'debt payoff calculator',
    'loan calculators',
    'credit score based rates',
    'monthly payment calculator',
    'loan comparison tools'
  ],
  openGraph: {
    title: 'Financial Calculators - Mortgage, Auto Loan & Credit Card Tools',
    description: 'Free financial calculators with personalized rates. Calculate mortgage payments, auto loans, credit card payoff, and compare loan options.',
    url: 'https://financial-calc.com/calculators',
  },
  alternates: {
    canonical: 'https://financial-calc.com/calculators',
  },
}

export default function CalculatorsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Financial Calculators",
    "description": "Collection of free financial calculators including mortgage, auto loan, and credit card payoff tools",
    "url": "https://financial-calc.com/calculators",
    "mainEntity": [
      {
        "@type": "SoftwareApplication",
        "name": "Mortgage Calculator",
        "description": "Calculate monthly mortgage payments with credit score-based interest rates",
        "url": "https://financial-calc.com/calculators/mortgage",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser"
      },
      {
        "@type": "SoftwareApplication", 
        "name": "Auto Loan Calculator",
        "description": "Calculate monthly auto loan payments for new and used vehicles",
        "url": "https://financial-calc.com/calculators/auto-loan",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser"
      },
      {
        "@type": "SoftwareApplication",
        "name": "Credit Card Payoff Calculator",
        "description": "Calculate credit card debt payoff time and total interest costs",
        "url": "https://financial-calc.com/calculators/credit-card",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 rounded-full p-4">
                <Calculator className="h-12 w-12 text-blue-600" aria-hidden="true" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
              Financial Calculators
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate loan payments and debt payoff strategies with personalized interest rates based on your credit score. 
              Choose from our collection of accurate financial tools designed to help you make informed decisions.
            </p>
          </div>

          {/* Calculator Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Mortgage Calculator Card */}
            <article>
              <Link href="/calculators/mortgage" className="group block h-full">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Home className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    <h2 className="ml-3 text-2xl font-semibold text-gray-900">Mortgage Calculator</h2>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Calculate your monthly mortgage payments with personalized interest rates based on your credit score.
                    Compare 15, 20, 25, and 30-year loan terms to find the best option for your budget.
                  </p>
                  
                  {/* Features List */}
                  <ul className="text-sm text-gray-500 mb-6 space-y-1">
                    <li>✓ Credit score-based interest rates</li>
                    <li>✓ Multiple loan term options</li>
                    <li>✓ Down payment calculator</li>
                    <li>✓ Total interest breakdown</li>
                  </ul>

                  <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
                    <span className="font-medium">Calculate Mortgage Payment</span>
                    <TrendingUp className="ml-2 h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>

            {/* Auto Loan Calculator Card */}
            <article>
              <Link href="/calculators/auto-loan" className="group block h-full">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Car className="h-8 w-8 text-green-600" aria-hidden="true" />
                    <h2 className="ml-3 text-2xl font-semibold text-gray-900">Auto Loan Calculator</h2>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Determine your auto loan payments with rates tailored to your credit profile and vehicle type.
                    Includes options for trade-in value, down payment, and new vs. used vehicle rates.
                  </p>
                  
                  {/* Features List */}
                  <ul className="text-sm text-gray-500 mb-6 space-y-1">
                    <li>✓ New and used vehicle rates</li>
                    <li>✓ Trade-in value calculator</li>
                    <li>✓ Flexible loan terms</li>
                    <li>✓ Credit-based pricing</li>
                  </ul>

                  <div className="flex items-center text-green-600 group-hover:text-green-800 transition-colors">
                    <span className="font-medium">Calculate Auto Payment</span>
                    <TrendingUp className="ml-2 h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>

            {/* Credit Card Calculator Card */}
            <article className="md:col-span-2 lg:col-span-1">
              <Link href="/calculators/credit-card" className="group block h-full">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-8 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-8 w-8 text-red-600" aria-hidden="true" />
                    <h2 className="ml-3 text-2xl font-semibold text-gray-900">Credit Card Payoff</h2>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow">
                    Calculate how long it takes to pay off credit card debt and total interest costs.
                    Compare minimum payment vs fixed payment strategies to save money.
                  </p>
                  
                  {/* Features List */}
                  <ul className="text-sm text-gray-500 mb-6 space-y-1">
                    <li>✓ Debt payoff time calculator</li>
                    <li>✓ Total interest breakdown</li>
                    <li>✓ Payment strategy comparison</li>
                    <li>✓ APR-based calculations</li>
                  </ul>

                  <div className="flex items-center text-red-600 group-hover:text-red-800 transition-colors">
                    <span className="font-medium">Calculate Debt Payoff</span>
                    <TrendingUp className="ml-2 h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>
          </div>

          {/* Latest Blog Post Section */}
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 mr-3" aria-hidden="true" />
                <h3 className="text-xl font-semibold text-gray-900">Latest from Our Blog</h3>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-grow mb-4 md:mb-0 md:mr-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    How Your Credit Score Affects Your Mortgage Rate
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Learn how credit scores impact mortgage interest rates and discover how much money you could save by improving your credit. 
                    Includes current rate examples and practical improvement tips.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    Published: September 7, 2025 • 6 minute read
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/blog/credit-score-mortgage-rate"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Read Article
                    <TrendingUp className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Why Our Calculators Are More Accurate
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Credit-Based Rates</h4>
                <p className="text-gray-600 text-sm">
                  Get personalized interest rates that reflect your actual credit score range, 
                  not generic estimates that could be off by hundreds of dollars per month.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calculator className="h-8 w-8 text-green-600" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Real-Time Data</h4>
                <p className="text-gray-600 text-sm">
                  Our calculations use current market data and industry-standard formulas 
                  to provide the most accurate payment estimates possible.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Home className="h-8 w-8 text-purple-600" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Complete Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Beyond monthly payments, see total interest costs, payment breakdowns, 
                  and suggestions for improving your loan terms.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}