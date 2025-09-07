'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, Car, ArrowLeft, Info } from 'lucide-react'
import { 
  creditRanges, 
  getCurrentRates, 
  getCreditRangeInfo,
  getCreditRangeValue,
  calculateMonthlyPayment,
  calculateTotalInterest 
} from '@/lib/rates'
import { useRates } from '@/lib/hooks/useRates'

// Helper function to convert live rates to auto loan rates
function convertLiveRatesToAutoRates(
  liveRates: { primeRate: number; mortgage30: number; mortgage15: number }, 
  creditScore: number, 
  term: number, 
  vehicleType: 'new' | 'used'
) {
  const { primeRate } = liveRates
  
  // Credit score spreads
  let creditSpread = 0
  if (creditScore >= 781) creditSpread = 0.5
  else if (creditScore >= 661) creditSpread = 2.0
  else if (creditScore >= 601) creditSpread = 4.0
  else if (creditScore >= 501) creditSpread = 8.0
  else creditSpread = 12.0
  
  // Term spread (longer terms = higher rates)
  const termSpread = term > 5 ? 1.0 : 0
  
  // Vehicle type spread
  const newCarRate = primeRate + creditSpread + termSpread
  const usedCarRate = newCarRate + 1.5 // Used cars typically +1.5% higher
  
  return {
    autoNewRate: Math.max(newCarRate, 3.0), // Minimum 3% rate
    autoUsedRate: Math.max(usedCarRate, 4.5) // Minimum 4.5% rate
  }
}

export default function AutoLoanCalculator() {
  // Live rates hook
  const { rates: liveRates, loading: ratesLoading, error: ratesError } = useRates()
  
  const [vehiclePrice, setVehiclePrice] = useState<string>('35,000')
  const [downPayment, setDownPayment] = useState<string>('7,000')
  const [tradeInValue, setTradeInValue] = useState<string>('0')
  const [loanTerm, setLoanTerm] = useState<string>('5')
  const [creditScore, setCreditScore] = useState<string>('704')
  const [vehicleType, setVehicleType] = useState<string>('new')
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

  const handleVehiclePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setVehiclePrice(formatted)
  }

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setDownPayment(formatted)
  }

  const handleTradeInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setTradeInValue(formatted)
  }

  const calculateResults = () => {
    const price = parseFormattedNumber(vehiclePrice)
    const down = parseFormattedNumber(downPayment)
    const tradeIn = parseFormattedNumber(tradeInValue)
    const term = parseFloat(loanTerm) || 5
    const score = parseInt(creditScore) || 704

    const loanAmount = price - down - tradeIn
    
    // Use live rates when available, fallback to static rates
    let rates
    if (liveRates) {
      rates = convertLiveRatesToAutoRates(liveRates, score, term, vehicleType as 'new' | 'used')
    } else {
      rates = getCurrentRates(score, term, vehicleType as 'new' | 'used')
    }
    
    // Use appropriate rate based on vehicle type
    const interestRate = vehicleType === 'new' ? rates.autoNewRate : rates.autoUsedRate
    
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, term)
    const totalInterest = calculateTotalInterest(monthlyPayment, term, loanAmount)

    setResults({
      monthlyPayment,
      totalInterest,
      interestRate,
      loanAmount
    })
  }

  useEffect(() => {
    calculateResults()
  }, [vehiclePrice, downPayment, tradeInValue, loanTerm, creditScore, vehicleType, liveRates])

  const creditRange = getCreditRangeInfo(parseInt(creditScore))
  const downPaymentPercent = ((parseFormattedNumber(downPayment) / parseFormattedNumber(vehiclePrice)) * 100).toFixed(1)
  const totalDownPayment = parseFormattedNumber(downPayment) + parseFormattedNumber(tradeInValue)

  // Structured data for SEO
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-green-600 hover:text-green-800 mr-4" aria-label="Return to homepage">
                <ArrowLeft className="h-5 w-5 mr-1" aria-hidden="true" />
                Back
              </Link>
              <Calculator className="h-8 w-8 text-green-600" aria-hidden="true" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Auto Loan Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Car className="h-6 w-6 text-green-600 mr-2" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">Loan Details</h2>
            </div>

            <form className="space-y-6" role="form" aria-label="Auto loan calculation form">
              {/* Vehicle Type */}
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </legend>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVehicleType('new')}
                    className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                      vehicleType === 'new'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    aria-pressed={vehicleType === 'new'}
                    aria-describedby="vehicle-type-help"
                  >
                    New Vehicle
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('used')}
                    className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                      vehicleType === 'used'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                    aria-pressed={vehicleType === 'used'}
                    aria-describedby="vehicle-type-help"
                  >
                    Used Vehicle
                  </button>
                </div>
                <p id="vehicle-type-help" className="sr-only">Select whether you&apos;re financing a new or used vehicle</p>
              </fieldset>

              {/* Vehicle Price */}
              <div>
                <label htmlFor="vehicle-price" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="vehicle-price"
                    name="vehicle-price"
                    type="text"
                    value={vehiclePrice}
                    onChange={handleVehiclePriceChange}
                    onBlur={() => setVehiclePrice(formatNumberInput(vehiclePrice))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="35,000"
                    aria-describedby="vehicle-price-help"
                  />
                </div>
                <p id="vehicle-price-help" className="sr-only">Enter the total purchase price of the vehicle</p>
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
                    className="w-full pl-8 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="7,000"
                    aria-describedby="down-payment-help"
                  />
                  <span className="absolute right-3 top-3 text-sm text-gray-500" aria-label={`${downPaymentPercent} percent down payment`}>
                    {downPaymentPercent}%
                  </span>
                </div>
                <p id="down-payment-help" className="sr-only">Enter your down payment amount</p>
              </div>

              {/* Trade-in Value */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="trade-in-value" className="block text-sm font-medium text-gray-700">
                    Trade-in Value (Optional)
                  </label>
                  <a
                    href="https://www.kbb.com/whats-my-car-worth/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:text-green-800 font-medium underline"
                    aria-label="Find trade-in value on Kelley Blue Book (opens in new tab)"
                  >
                    Find My Trade Value →
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="trade-in-value"
                    name="trade-in-value"
                    type="text"
                    value={tradeInValue}
                    onChange={handleTradeInChange}
                    onBlur={() => setTradeInValue(formatNumberInput(tradeInValue))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                    aria-describedby="trade-in-help"
                  />
                </div>
                <p id="trade-in-help" className="mt-1 text-xs text-gray-500">
                  Use KBB, Edmunds, or your dealer&apos;s appraisal for accurate values
                </p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  aria-describedby="loan-term-help"
                >
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="4">4 years</option>
                  <option value="5">5 years</option>
                  <option value="6">6 years</option>
                  <option value="7">7 years</option>
                </select>
                <p id="loan-term-help" className="sr-only">Select auto loan term length</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  aria-describedby="credit-score-help"
                >
                  {creditRanges.map((range) => (
                    <option key={range.min} value={getCreditRangeValue(range)}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <p id="credit-score-help" className="text-sm text-green-800">{creditRange.description}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {ratesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading current rates...</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Payment</h2>
                
                {/* Main Payment Display */}
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-green-600 mb-2" aria-label={`Monthly payment of $${results.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}>
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
                    <dt className="text-gray-700">Interest Rate ({vehicleType} vehicle)</dt>
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
                  
                  {totalDownPayment > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <dt className="text-gray-700">Total Down Payment</dt>
                      <dd className="font-semibold text-green-600">
                        ${totalDownPayment.toLocaleString('en-US', { 
                          minimumFractionDigits: 0, 
                          maximumFractionDigits: 0 
                        })}
                      </dd>
                    </div>
                  )}
                  
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

                {/* Rate Source Indicator */}
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    {liveRates ? '✅ Using current market rates' : '⚠️ Using estimated rates'}
                    {ratesError && ` (${ratesError})`}
                  </p>
                </div>

                {/* Credit Impact Notice */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">💡 Improve Your Rate</h4>
                  <p className="text-sm text-green-700">
                    Improving your credit score could save you thousands in interest. 
                    Consider paying down existing debt before applying.
                  </p>
                </div>

                {/* Vehicle Type Notice */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">🚗 New vs Used</h4>
                  <p className="text-sm text-blue-700">
                    New vehicles typically offer lower interest rates but higher prices. 
                    Used vehicles have higher rates but better value.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Your Auto Loan</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Down Payment Benefits</h4>
              <p>Larger down payments reduce your loan amount, monthly payment, and total interest paid over the loan term.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Trade-in Value</h4>
              <p>Your trade-in acts as additional down payment, reducing the amount you need to finance.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Loan Term Impact</h4>
              <p>Shorter terms mean higher monthly payments but less total interest. Longer terms reduce monthly payments but increase total cost.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">New vs Used Rates</h4>
              <p>New vehicle loans typically offer lower interest rates as they&apos;re considered less risky by lenders.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}