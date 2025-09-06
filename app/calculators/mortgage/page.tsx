'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, Home, ArrowLeft, Info } from 'lucide-react'
import { 
  creditRanges, 
  getCurrentRates, 
  getCreditRangeInfo,
  getCreditRangeValue,
  calculateMonthlyPayment,
  calculateTotalInterest 
} from '@/lib/rates'

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<string>('400,000')
  const [downPayment, setDownPayment] = useState<string>('80,000')
  const [loanTerm, setLoanTerm] = useState<string>('30')
  const [creditScore, setCreditScore] = useState<string>('704')
  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalInterest: 0,
    interestRate: 0,
    loanAmount: 0
  })

  // Helper functions for number formatting
  const formatNumberInput = (value: string): string => {
    // Remove all non-digits
    const numericValue = value.replace(/\D/g, '')
    // Add commas for thousands
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const parseFormattedNumber = (value: string): number => {
    // Remove commas and convert to number
    return parseFloat(value.replace(/,/g, '')) || 0
  }

  const handleHomePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setHomePrice(formatted)
  }

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setDownPayment(formatted)
  }

  const calculateResults = () => {
    const price = parseFormattedNumber(homePrice)
    const down = parseFormattedNumber(downPayment)
    const term = parseFloat(loanTerm) || 30
    const score = parseInt(creditScore) || 704

    const loanAmount = price - down
    const rates = getCurrentRates(score, term)  // Pass term to get term-adjusted rate
    const monthlyPayment = calculateMonthlyPayment(loanAmount, rates.mortgageRate, term)
    const totalInterest = calculateTotalInterest(monthlyPayment, term, loanAmount)

    setResults({
      monthlyPayment,
      totalInterest,
      interestRate: rates.mortgageRate,
      loanAmount
    })
  }

  useEffect(() => {
    calculateResults()
  }, [homePrice, downPayment, loanTerm, creditScore])

  const creditRange = getCreditRangeInfo(parseInt(creditScore))
  const downPaymentPercent = ((parseFormattedNumber(downPayment) / parseFormattedNumber(homePrice)) * 100).toFixed(1)

  // Structured data for SEO
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

  useEffect(() => {
    // Add structured data to page
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mr-4" aria-label="Return to homepage">
                <ArrowLeft className="h-5 w-5 mr-1" aria-hidden="true" />
                Back
              </Link>
              <Calculator className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Mortgage Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Home className="h-6 w-6 text-blue-600 mr-2" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">Loan Details</h2>
            </div>

            <form className="space-y-6" role="form" aria-label="Mortgage calculation form">
              {/* Home Price */}
              <div>
                <label htmlFor="home-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Home Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="home-price"
                    name="home-price"
                    type="text"
                    value={homePrice}
                    onChange={handleHomePriceChange}
                    onBlur={() => setHomePrice(formatNumberInput(homePrice))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="400,000"
                    aria-describedby="home-price-help"
                  />
                </div>
                <p id="home-price-help" className="sr-only">Enter the total purchase price of the home</p>
              </div>

              {/* Down Payment */}
              <div>
                <label htmlFor="down-payment" className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="down-payment"
                    name="down-payment"
                    type="text"
                    value={downPayment}
                    onChange={handleDownPaymentChange}
                    onBlur={() => setDownPayment(formatNumberInput(downPayment))}
                    className="w-full pl-8 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="80,000"
                    aria-describedby="down-payment-help"
                  />
                  <span className="absolute right-3 top-3 text-sm text-gray-500" aria-label={`${downPaymentPercent} percent down payment`}>
                    {downPaymentPercent}%
                  </span>
                </div>
                <p id="down-payment-help" className="sr-only">Enter your down payment amount</p>
              </div>

              {/* Loan Term */}
              <div>
                <label htmlFor="loan-term" className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term
                </label>
                <select
                  id="loan-term"
                  name="loan-term"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-describedby="loan-term-help"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
                <p id="loan-term-help" className="sr-only">Select mortgage loan term length</p>
              </div>

              {/* Credit Score */}
              <div>
                <label htmlFor="credit-score" className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Score Range
                </label>
                <select
                  id="credit-score"
                  name="credit-score"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-describedby="credit-score-help"
                >
                  {creditRanges.map((range) => (
                    <option key={range.min} value={getCreditRangeValue(range)}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <p id="credit-score-help" className="text-sm text-blue-800">{creditRange.description}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Payment</h2>
            
            {/* Main Payment Display */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-blue-600 mb-2" aria-label={`Monthly payment of $${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}>
                ${results.monthlyPayment.toLocaleString('en-US', { 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: 0 
                })}
              </div>
              <p className="text-gray-600">per month</p>
            </div>

            {/* Breakdown */}
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className="text-gray-700">Interest Rate</dt>
                <dd className="font-semibold text-lg">{results.interestRate.toFixed(2)}%</dd>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className="text-gray-700">Loan Amount</dt>
                <dd className="font-semibold">
                  ${results.loanAmount.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className="text-gray-700">Total Interest</dt>
                <dd className="font-semibold text-red-600">
                  ${results.totalInterest.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <dt className="text-gray-700 font-medium">Total Payment</dt>
                <dd className="font-bold text-lg">
                  ${(results.loanAmount + results.totalInterest).toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </dd>
              </div>
            </dl>

            {/* Credit Impact Notice */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">💡 Improve Your Rate</h4>
              <p className="text-sm text-green-700">
                Improving your credit score could save you thousands in interest. 
                Each tier up typically reduces your rate by 0.3-0.8%.
              </p>
            </div>

            {/* Term Benefit Notice */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">⏰ Shorter Terms Save More</h4>
              <p className="text-sm text-blue-700">
                15-year loans have lower rates and save massive amounts in total interest, 
                but require higher monthly payments.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Your Mortgage</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Principal & Interest</h4>
              <p>Your monthly payment covers the loan principal (amount borrowed) plus interest charges.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Credit Score Impact</h4>
              <p>Higher credit scores qualify for better interest rates, potentially saving tens of thousands over the loan term.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Down Payment Benefits</h4>
              <p>Larger down payments reduce your loan amount and may help you avoid private mortgage insurance (PMI).</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">