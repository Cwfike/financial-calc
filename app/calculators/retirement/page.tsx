'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Info } from 'lucide-react'
import {
  creditRanges,
  getCreditRangeInfo,
  getCreditRangeValue,
} from '@/lib/rates'

// Monthly interest premium vs. excellent credit (estimated across avg US debt load)
// Based on typical mortgage + auto + credit card debt at each credit tier
const creditScoreMonthlyPremium: Record<string, number> = {
  'Poor (300-579)': 780,
  'Fair (580-669)': 420,
  'Good (670-739)': 175,
  'Very Good (740-799)': 60,
  'Excellent (800+)': 0,
}

// Return rate options
const returnOptions = [
  { label: 'Conservative (5%)', value: 5 },
  { label: 'Moderate (7%)', value: 7 },
  { label: 'Aggressive (9%)', value: 9 },
]

function projectRetirement(
  currentSavings: number,
  monthlyContribution: number,
  annualReturnRate: number,
  monthsToRetirement: number
): {
  projectedSavings: number
  totalContributions: number
  investmentGrowth: number
  monthlyIncome: number
} {
  if (monthsToRetirement <= 0) {
    return {
      projectedSavings: currentSavings,
      totalContributions: currentSavings,
      investmentGrowth: 0,
      monthlyIncome: (currentSavings * 0.04) / 12,
    }
  }

  const r = annualReturnRate / 100 / 12
  const n = monthsToRetirement

  const projectedSavings =
    currentSavings * Math.pow(1 + r, n) +
    monthlyContribution * ((Math.pow(1 + r, n) - 1) / r)

  const totalContributions = currentSavings + monthlyContribution * n
  const investmentGrowth = projectedSavings - totalContributions
  const monthlyIncome = (projectedSavings * 0.04) / 12

  return { projectedSavings, totalContributions, investmentGrowth, monthlyIncome }
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return '$' + (value / 1_000_000).toFixed(2) + 'M'
  }
  return '$' + Math.round(value).toLocaleString('en-US')
}

function formatNumberInput(value: string): string {
  const numericValue = value.replace(/\D/g, '')
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState<string>('35')
  const [retirementAge, setRetirementAge] = useState<string>('65')
  const [currentSavings, setCurrentSavings] = useState<string>('25,000')
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500')
  const [annualReturn, setAnnualReturn] = useState<number>(7)
  const [creditScore, setCreditScore] = useState<string>('704')

  const [results, setResults] = useState({
    projectedSavings: 0,
    totalContributions: 0,
    investmentGrowth: 0,
    monthlyIncome: 0,
    yearsToRetirement: 0,
    boostedSavings: 0,
    boostedMonthlyIncome: 0,
    monthlyPremium: 0,
  })

  const [ageError, setAgeError] = useState<string>('')

  useEffect(() => {
    const age = parseInt(currentAge) || 35
    const retAge = parseInt(retirementAge) || 65
    const savings = parseFormattedNumber(currentSavings)
    const contribution = parseFormattedNumber(monthlyContribution)

    if (retAge <= age) {
      setAgeError('Retirement age must be greater than current age')
      return
    }
    setAgeError('')

    const yearsToRetirement = retAge - age
    const monthsToRetirement = yearsToRetirement * 12

    const base = projectRetirement(savings, contribution, annualReturn, monthsToRetirement)

    // Credit score angle: show boosted projection if half the monthly premium
    // was redirected into retirement contributions
    const creditRange = getCreditRangeInfo(parseInt(creditScore))
    const monthlyPremium = creditScoreMonthlyPremium[creditRange.label] ?? 0
    const boostedContribution = contribution + monthlyPremium / 2

    const boosted = projectRetirement(savings, boostedContribution, annualReturn, monthsToRetirement)

    setResults({
      projectedSavings: base.projectedSavings,
      totalContributions: base.totalContributions,
      investmentGrowth: base.investmentGrowth,
      monthlyIncome: base.monthlyIncome,
      yearsToRetirement,
      boostedSavings: boosted.projectedSavings,
      boostedMonthlyIncome: boosted.monthlyIncome,
      monthlyPremium,
    })
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, creditScore])

  const creditRange = getCreditRangeInfo(parseInt(creditScore))

  // Contribution vs growth percentages for the visual bar
  const total = results.projectedSavings || 1
  const contributionPct = Math.round((results.totalContributions / total) * 100)
  const growthPct = 100 - contributionPct

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retirement Calculator
          </h1>
          <p className="text-gray-600">
            Project your retirement savings and estimated monthly income — and see how reducing high-interest debt could supercharge your nest egg.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Inputs ── */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-2" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">Your Details</h2>
            </div>

            <form className="space-y-6" role="form" aria-label="Retirement calculation form">

              {/* Ages */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="current-age" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Age
                  </label>
                  <input
                    id="current-age"
                    name="current-age"
                    type="number"
                    min="18"
                    max="80"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    aria-describedby="age-help"
                  />
                </div>
                <div>
                  <label htmlFor="retirement-age" className="block text-sm font-medium text-gray-700 mb-2">
                    Retirement Age
                  </label>
                  <input
                    id="retirement-age"
                    name="retirement-age"
                    type="number"
                    min="40"
                    max="80"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    aria-describedby="age-help"
                  />
                </div>
              </div>
              {ageError && (
                <p className="text-sm text-red-600 -mt-4" role="alert">{ageError}</p>
              )}
              <p id="age-help" className="sr-only">Enter your current age and target retirement age</p>

              {/* Current Savings */}
              <div>
                <label htmlFor="current-savings" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Retirement Savings
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="current-savings"
                    name="current-savings"
                    type="text"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(formatNumberInput(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="25,000"
                    aria-describedby="savings-help"
                  />
                </div>
                <p id="savings-help" className="mt-1 text-xs text-gray-500">
                  Combined 401(k), IRA, and other retirement accounts
                </p>
              </div>

              {/* Monthly Contribution */}
              <div>
                <label htmlFor="monthly-contribution" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="monthly-contribution"
                    name="monthly-contribution"
                    type="text"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(formatNumberInput(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="500"
                    aria-describedby="contribution-help"
                  />
                </div>
                <p id="contribution-help" className="mt-1 text-xs text-gray-500">
                  2026 limits: 401(k) $23,000/yr · IRA $7,000/yr
                </p>
              </div>

              {/* Expected Return */}
              <div>
                <label htmlFor="annual-return" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return
                </label>
                <select
                  id="annual-return"
                  name="annual-return"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  aria-describedby="return-help"
                >
                  {returnOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p id="return-help" className="mt-1 text-xs text-gray-500">
                  The S&P 500 has averaged ~10% historically; 7% accounts for inflation
                </p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  aria-describedby="credit-help"
                >
                  {creditRanges.map((range) => (
                    <option key={range.min} value={getCreditRangeValue(range)}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <p id="credit-help" className="text-sm text-purple-800">{creditRange.description}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* ── Results ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Projection</h2>

              {ageError ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Please enter a valid retirement age to see your projection.</p>
                </div>
              ) : (
                <>
                  {/* Primary number */}
                  <div className="text-center mb-8">
                    <p className="text-sm text-gray-500 mb-1">Projected savings at age {retirementAge}</p>
                    <div
                      className="text-5xl font-bold text-purple-600 mb-2"
                      aria-label={`Projected retirement savings: ${formatCurrency(results.projectedSavings)}`}
                    >
                      {formatCurrency(results.projectedSavings)}
                    </div>
                    <p className="text-gray-500 text-sm">in {results.yearsToRetirement} years</p>
                  </div>

                  {/* Key stats */}
                  <dl className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <dt className="text-gray-700">Est. Monthly Income</dt>
                      <dd className="font-semibold text-lg text-green-600">
                        {formatCurrency(results.monthlyIncome)}/mo
                      </dd>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <dt className="text-gray-700">Total Contributions</dt>
                      <dd className="font-semibold">{formatCurrency(results.totalContributions)}</dd>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <dt className="text-gray-700">Investment Growth</dt>
                      <dd className="font-semibold text-purple-600">{formatCurrency(results.investmentGrowth)}</dd>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <dt className="text-gray-700">Annual Return Rate</dt>
                      <dd className="font-semibold">{annualReturn}%</dd>
                    </div>
                  </dl>

                  {/* Contributions vs Growth bar */}
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 mb-2">Contributions vs. Investment Growth</p>
                    <div className="flex rounded-full overflow-hidden h-4" aria-label={`${contributionPct}% contributions, ${growthPct}% investment growth`}>
                      <div
                        className="bg-gray-300 transition-all duration-500"
                        style={{ width: `${contributionPct}%` }}
                        title={`Contributions: ${contributionPct}%`}
                      />
                      <div
                        className="bg-purple-500 transition-all duration-500"
                        style={{ width: `${growthPct}%` }}
                        title={`Growth: ${growthPct}%`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Your contributions ({contributionPct}%)</span>
                      <span>Market growth ({growthPct}%)</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Monthly income estimate uses the 4% safe withdrawal rule — a widely accepted retirement planning guideline.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Credit Score Boost Panel */}
            {!ageError && results.monthlyPremium > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Free Up More for Retirement
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Borrowers with <strong>{creditRange.label}</strong> credit pay an estimated{' '}
                  <strong className="text-red-600">${results.monthlyPremium.toLocaleString()}/month</strong> more
                  in loan interest than those with Excellent credit. If you redirected just half of
                  that into retirement savings, your projection improves significantly:
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Current projection</p>
                    <p className="font-bold text-gray-800">{formatCurrency(results.projectedSavings)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(results.monthlyIncome)}/mo income</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-xs text-purple-600 mb-1">With debt savings redirected</p>
                    <p className="font-bold text-purple-700">{formatCurrency(results.boostedSavings)}</p>
                    <p className="text-xs text-purple-600">{formatCurrency(results.boostedMonthlyIncome)}/mo income</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Difference:{' '}
                  <strong className="text-purple-700">
                    +{formatCurrency(results.boostedSavings - results.projectedSavings)}
                  </strong>{' '}
                  more at retirement by reducing high-interest debt.
                </p>
                <Link
                  href="/calculators/debt-consolidation"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  See if debt consolidation could help →
                </Link>
              </div>
            )}

            {/* Excellent credit — affirm and suggest mortgage */}
            {!ageError && results.monthlyPremium === 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-base font-semibold text-green-800 mb-2">
                  ✅ Excellent Credit — You&apos;re Already Ahead
                </h2>
                <p className="text-sm text-gray-600">
                  With excellent credit you&apos;re already paying minimal interest on debt, which maximizes
                  the money available for retirement. Keep contributing consistently — compounding does
                  the rest.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Understanding section */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Understanding Your Retirement</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">The Power of Compounding</h3>
              <p>
                Starting earlier matters more than contributing more later. Money invested at 35 has 30 years
                to compound; money invested at 50 has only 15. Even small early contributions create
                outsized results at retirement.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">The 4% Rule</h3>
              <p>
                The estimated monthly income shown uses the 4% safe withdrawal rate — a guideline suggesting
                you can withdraw 4% of your savings annually without depleting your nest egg over a 30-year
                retirement.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Credit Score & Debt</h3>
              <p>
                High-interest debt is the silent retirement killer. Every extra dollar paid in loan interest
                is a dollar that can&apos;t compound in your retirement account. Improving your credit score
                or{' '}
                <Link href="/calculators/debt-consolidation" className="text-purple-600 hover:text-purple-800 underline">
                  consolidating debt
                </Link>{' '}
                directly increases the money available to invest.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">2026 Contribution Limits</h3>
              <p>
                Max out tax-advantaged accounts first: 401(k) up to $23,000/year ($30,500 if 50+), IRA
                up to $7,000/year ($8,000 if 50+). Employer 401(k) matches are free money — always
                contribute at least enough to capture the full match.
              </p>
            </div>
          </div>
        </section>

        {/* Related Calculators */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8" aria-label="Related calculators">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Calculators</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/calculators/mortgage" className="block p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-purple-600 mb-1">Mortgage Calculator</div>
              <div className="text-sm text-gray-500">Calculate home loan payments based on your credit score</div>
            </Link>
            <Link href="/calculators/debt-consolidation" className="block p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-purple-600 mb-1">Debt Consolidation Calculator</div>
              <div className="text-sm text-gray-500">Free up monthly cash flow to invest more for retirement</div>
            </Link>
            <Link href="/calculators/credit-card" className="block p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-purple-600 mb-1">Credit Card Payoff Calculator</div>
              <div className="text-sm text-gray-500">Pay off high-interest debt faster to redirect savings</div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
