import Link from 'next/link'
import { Calculator, Car, CreditCard, Home, TrendingUp, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Calc - Free Mortgage, Auto Loan & Credit Card Calculators',
  description: 'Calculate mortgage, auto loan, and credit card payoff with personalized interest rates based on your credit score. Get accurate monthly payments, total interest, and debt payoff strategies instantly.',
  keywords: [
    'mortgage calculator',
    'auto loan calculator',
    'credit card payoff calculator',
    'loan payment calculator',
    'debt payoff calculator',
    'credit score mortgage rates',
    'monthly payment calculator',
    'home loan calculator',
    'car financing calculator',
    'interest rate calculator'
  ],
  openGraph: {
    title: 'Financial Calc - Free Mortgage, Auto Loan & Credit Card Calculators',
    description: 'Calculate loan payments and debt payoff with credit-based interest rates. Free, accurate financial calculators with real-time results.',
    url: 'https://financial-calc.com',
    images: [
      {
        url: '/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'Financial Calc Homepage - Mortgage and Auto Loan Calculators',
      },
    ],
  },
  alternates: {
    canonical: 'https://financial-calc.com',
  },
}

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Financial Calc",
    "description": "Free mortgage, auto loan, and credit card payoff calculators with credit-based interest rates",
    "url": "https://financial-calc.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://financial-calc.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Financial Calc",
      "url": "https://financial-calc.com"
    },
    "mainEntity": [
      {
        "@type": "SoftwareApplication",
        "name": "Mortgage Calculator",
        "description": "Calculate monthly mortgage payments with credit score-based interest rates",
        "url": "https://financial-calc.com/calculators/mortgage",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Auto Loan Calculator",
        "description": "Calculate monthly auto loan payments for new and used vehicles",
        "url": "https://financial-calc.com/calculators/auto-loan",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Credit Card Payoff Calculator",
        "description": "Calculate credit card debt payoff time and total interest costs",
        "url": "https://financial-calc.com/calculators/credit-card",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
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
        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Smart Financial Calculators
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Get accurate loan calculations and debt payoff strategies with personalized interest rates based on your credit score. 
              Make informed financial decisions with our easy-to-use tools.
            </p>
          </div>

          {/* Calculator Cards */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Mortgage Calculator Card */}
            <article>
              <Link href="/calculators/mortgage" className="group block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8">
                  <div className="flex items-center mb-4">
                    <Home className="h-8 w-8 text-blue-600" aria-hidden="true" />
                    <h3 className="ml-3 text-2xl font-semibold text-gray-900">Mortgage Calculator</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Calculate your monthly mortgage payments with personalized interest rates based on your credit score and loan terms.
                  </p>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors">
                    <span className="font-medium">Calculate Mortgage Payment</span>
                    <TrendingUp className="ml-2 h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>

            {/* Auto Loan Calculator Card */}
            <article>
              <Link href="/calculators/auto-loan" className="group block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8">
                  <div className="flex items-center mb-4">
                    <Car className="h-8 w-8 text-green-600" aria-hidden="true" />
                    <h3 className="ml-3 text-2xl font-semibold text-gray-900">Auto Loan Calculator</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Determine your auto loan payments with rates tailored to your credit profile and vehicle type, including trade-in options.
                  </p>
                  <div className="flex items-center text-green-600 group-hover:text-green-800 transition-colors">
                    <span className="font-medium">Calculate Auto Payment</span>
                    <TrendingUp className="ml-2 h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>

            {/* Credit Card Calculator Card */}
            <article className="md:col-span-2 lg:col-span-1">
              <Link href="/calculators/credit-card" className="group block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-8">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-8 w-8 text-red-600" aria-hidden="true" />
                    <h3 className="ml-3 text-2xl font-semibold text-gray-900">Credit Card Payoff</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Calculate how long it takes to pay off credit card debt and total interest costs.
                    Compare minimum vs fixed payment strategies.
                  </p>
                  <div className="flex items-center text-red-600 group-hover:text-red-800 transition-colors">
                    <span className="font-medium">Calculate Debt Payoff</span>
                    <TrendingUp className="ml-2 h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </article>
          </div>

          {/* Latest Blog Post Section */}
          <section className="mt-20 mb-20">
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

          {/* Features Section */}
          <section className="mt-20">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Our Calculators?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Credit-Based Rates</h4>
                <p className="text-gray-600">Get personalized interest rates based on your actual credit score range for more accurate calculations.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calculator className="h-8 w-8 text-green-600" aria-hidden="true" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Accurate Calculations</h4>
                <p className="text-gray-600">Real-time calculations with current market data and industry-standard loan formulas.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Home className="h-8 w-8 text-purple-600" aria-hidden="true" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Mobile Friendly</h4>
                <p className="text-gray-600">Works perfectly on all devices - phone, tablet, or desktop with responsive design.</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 Financial Calc. Helping you make informed financial decisions.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}