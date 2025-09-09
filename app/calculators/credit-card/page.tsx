'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Clock, DollarSign } from 'lucide-react'

// Credit card payoff calculation functions
function calculateCreditCardPayoff(balance: number, apr: number, monthlyPayment: number) {
  if (balance <= 0 || monthlyPayment <= 0) {
    return {
      monthsToPayoff: 0,
      totalInterest: 0,
      totalPaid: 0,
      monthlyInterest: 0
    }
  }

  const monthlyRate = apr / 100 / 12
  const monthlyInterest = balance * monthlyRate

  // If payment is less than monthly interest, debt will never be paid off
  if (monthlyPayment <= monthlyInterest) {
    return {
      monthsToPayoff: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      monthlyInterest
    }
  }

  // Calculate months to payoff using the formula
  const monthsToPayoff = -Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate)
  const totalPaid = monthlyPayment * monthsToPayoff
  const totalInterest = totalPaid - balance

  return {
    monthsToPayoff,
    totalInterest,
    totalPaid,
    monthlyInterest
  }
}

function calculateMinimumPayment(balance: number, apr: number) {
  // Typical minimum payment is 1-3% of balance, or $25 minimum
  const percentagePayment = balance * 0.02 // 2% is common
  const interestPayment = (balance * (apr / 100) / 12) + 10 // Interest plus $10 principal
  return Math.max(25, Math.max(percentagePayment, interestPayment))
}

export default function CreditCardCalculator() {
  const [balance, setBalance] = useState<string>('5,000')
  const [apr, setApr] = useState<string>('22.99')
  const [monthlyPayment, setMonthlyPayment] = useState<string>('200')
  const [paymentStrategy, setPaymentStrategy] = useState<'minimum' | 'fixed'>('fixed')
  const [results, setResults] = useState({
    monthsToPayoff: 0,
    totalInterest: 0,
    totalPaid: 0,
    monthlyInterest: 0
  })
  const [minimumPaymentAmount, setMinimumPaymentAmount] = useState(0)

  // Helper functions for number formatting
  const formatNumberInput = (value: string): string => {
    // Remove all non-digits and decimal points
    const numericValue = value.replace(/[^\d.]/g, '')
    // Handle multiple decimal points
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }
    // Add commas for thousands (only to the integer part)
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return parts.join('.')
  }

  const parseFormattedNumber = (value: string): number => {
    // Remove commas and convert to number
    return parseFloat(value.replace(/,/g, '')) || 0
  }

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setBalance(formatted)
  }

  const handleMonthlyPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberInput(e.target.value)
    setMonthlyPayment(formatted)
  }

  const calculateResults = () => {
    const balanceAmount = parseFormattedNumber(balance)
    const aprRate = parseFormattedNumber(apr)
    const minPayment = calculateMinimumPayment(balanceAmount, aprRate)
    setMinimumPaymentAmount(minPayment)

    let paymentAmount: number
    if (paymentStrategy === 'minimum') {
      paymentAmount = minPayment
      setMonthlyPayment(minPayment.toFixed(0))
    } else {
      paymentAmount = parseFormattedNumber(monthlyPayment)
    }

    const payoffResults = calculateCreditCardPayoff(balanceAmount, aprRate, paymentAmount)
    setResults(payoffResults)
  }

  useEffect(() => {
    calculateResults()
  }, [balance, apr, monthlyPayment, paymentStrategy])

  // Format years and months
  const formatPayoffTime = (months: number) => {
    if (!isFinite(months)) return 'Never (payment too low)'
    if (months <= 0) return '0 months'
    
    const years = Math.floor(months / 12)
    const remainingMonths = Math.round(months % 12)
    
    if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Credit Card Payoff Calculator",
    "description": "Calculate how long it takes to pay off credit card debt, total interest costs, and compare payment strategies",
    "url": "https://financial-calc.com/calculators/credit-card",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Credit card payoff time calculation",
      "Total interest calculation",
      "Minimum vs fixed payment comparison",
      "Monthly interest breakdown",
      "Debt elimination strategies",
      "APR-based calculations"
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-red-600 mr-2" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">Card Details</h2>
            </div>

            <form className="space-y-6" role="form" aria-label="Credit card payoff calculation form">
              {/* Current Balance */}
              <div>
                <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="balance"
                    name="balance"
                    type="text"
                    value={balance}
                    onChange={handleBalanceChange}
                    onBlur={() => setBalance(formatNumberInput(balance))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="5,000"
                    aria-describedby="balance-help"
                  />
                </div>
                <p id="balance-help" className="sr-only">Enter your current credit card balance</p>
              </div>

              {/* APR */}
              <div>
                <label htmlFor="apr" className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Percentage Rate (APR)
                </label>
                <div className="relative">
                  <input
                    id="apr"
                    name="apr"
                    type="text"
                    value={apr}
                    onChange={(e) => setApr(e.target.value)}
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="22.99"
                    aria-describedby="apr-help"
                  />
                  <span className="absolute right-3 top-3 text-gray-500" aria-hidden="true">%</span>
                </div>
                <p id="apr-help" className="mt-1 text-xs text-gray-500">
                  Find this on your credit card statement or online account
                </p>
              </div>

              {/* Payment Strategy */}
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Strategy
                </legend>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentStrategy('minimum')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      paymentStrategy === 'minimum'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    aria-pressed={paymentStrategy === 'minimum'}
                  >
                    <div className="font-medium text-gray-900">Minimum Payment Only</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Pay only the minimum required (${minimumPaymentAmount.toFixed(0)}/month)
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentStrategy('fixed')}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      paymentStrategy === 'fixed'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    aria-pressed={paymentStrategy === 'fixed'}
                  >
                    <div className="font-medium text-gray-900">Fixed Payment Amount</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Pay a consistent amount each month
                    </div>
                  </button>
                </div>
              </fieldset>

              {/* Monthly Payment - Only show for fixed payment strategy */}
              {paymentStrategy === 'fixed' && (
                <div>
                  <label htmlFor="monthly-payment" className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Payment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                    <input
                      id="monthly-payment"
                      name="monthly-payment"
                      type="text"
                      value={monthlyPayment}
                      onChange={handleMonthlyPaymentChange}
                      onBlur={() => setMonthlyPayment(formatNumberInput(monthlyPayment))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="200"
                      aria-describedby="payment-help"
                    />
                  </div>
                  <p id="payment-help" className="mt-1 text-xs text-gray-500">
                    Must be more than monthly interest (${results.monthlyInterest.toFixed(2)}) to make progress
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payoff Summary</h2>
            
            {/* Main Time Display */}
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-red-600 mb-2" aria-label={`Payoff time: ${formatPayoffTime(results.monthsToPayoff)}`}>
                {formatPayoffTime(results.monthsToPayoff)}
              </div>
              <p className="text-gray-600">to pay off debt</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {isFinite(results.monthsToPayoff) ? Math.ceil(results.monthsToPayoff) : '∞'}
                </div>
                <div className="text-sm text-gray-600">Total Payments</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">
                  ${isFinite(results.totalInterest) ? results.totalInterest.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  }) : '∞'}
                </div>
                <div className="text-sm text-gray-600">Total Interest</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className="text-gray-700">Monthly Payment</dt>
                <dd className="font-semibold text-lg">
                  ${(paymentStrategy === 'minimum' ? minimumPaymentAmount : parseFormattedNumber(monthlyPayment)).toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className="text-gray-700">Monthly Interest Charge</dt>
                <dd className="font-semibold text-red-600">
                  ${results.monthlyInterest.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className="text-gray-700">Current Balance</dt>
                <dd className="font-semibold">
                  ${parseFormattedNumber(balance).toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <dt className="text-gray-700">Total Interest Paid</dt>
                <dd className="font-semibold text-red-600">
                  ${isFinite(results.totalInterest) ? results.totalInterest.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  }) : 'Infinite'}
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <dt className="text-gray-700 font-medium">Total Amount Paid</dt>
                <dd className="font-bold text-lg">
                  ${isFinite(results.totalPaid) ? results.totalPaid.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  }) : 'Infinite'}
                </dd>
              </div>
            </dl>

            {/* Warning for low payments */}
            {results.monthsToPayoff === Infinity && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">⚠️ Payment Too Low</h4>
                <p className="text-sm text-red-700">
                  Your payment (${(paymentStrategy === 'minimum' ? minimumPaymentAmount : parseFormattedNumber(monthlyPayment)).toFixed(2)}) 
                  is less than or equal to your monthly interest charge (${results.monthlyInterest.toFixed(2)}). 
                  You need to pay at least ${(results.monthlyInterest + 1).toFixed(2)} per month to make progress.
                </p>
              </div>
            )}

            {/* Improvement tip */}
            {isFinite(results.monthsToPayoff) && results.monthsToPayoff > 12 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">💡 Pay It Off Faster</h4>
                <p className="text-sm text-green-700">
                  Doubling your payment to ${((paymentStrategy === 'minimum' ? minimumPaymentAmount : parseFormattedNumber(monthlyPayment)) * 2).toFixed(0)} 
                  could save you hundreds in interest and cut your payoff time significantly.
                </p>
              </div>
            )}

            {/* Strategy tip */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">🎯 Smart Strategy</h4>
              <p className="text-sm text-blue-700">
                Focus on paying more than the minimum, avoid new charges, and consider a balance transfer to a lower APR card if available.
              </p>
            </div>
          </div>
        </div>

        {/* Educational Info */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Understanding Credit Card Debt</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Minimum Payments</h4>
              <p>Credit card minimum payments are typically 1-3% of your balance or $25, whichever is higher. Paying only the minimum means most of your payment goes to interest.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Interest Compounds Daily</h4>
              <p>Credit card interest compounds daily, meaning you pay interest on interest. The sooner you pay off your balance, the less total interest you&apos;ll pay.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Payment Strategies</h4>
              <p>Pay more than the minimum whenever possible. Even an extra $25-50 per month can significantly reduce your payoff time and total interest.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Avoid New Charges</h4>
              <p>Stop using the card while paying it off. New purchases make it harder to pay down your balance and extend your debt payoff timeline.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}