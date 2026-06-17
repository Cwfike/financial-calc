'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LineChart, Info } from 'lucide-react'
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

function projectInvestment(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  months: number
): {
  futureValue: number
  totalContributions: number
  totalInterest: number
} {
  if (months <= 0) {
    return {
      futureValue: principal,
      totalContributions: principal,
      totalInterest: 0,
    }
  }

  const r = annualRate / 100 / 12

  let futureValue: number
  if (r === 0) {
    futureValue = principal + monthlyContribution * months
  } else {
    // Monthly compounding with end-of-month contributions (ordinary annuity)
    futureValue =
      principal * Math.pow(1 + r, months) +
      monthlyContribution * ((Math.pow(1 + r, months) - 1) / r)
  }

  const totalContributions = principal + monthlyContribution * months
  const totalInterest = futureValue - totalContributions

  return { futureValue, totalContributions, totalInterest }
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

export default function CompoundInterestCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<string>('10,000')
  const [monthlyContribution, setMonthlyContribution] = useState<string>('300')
  const [annualRate, setAnnualRate] = useState<string>('7')
  const [years, setYears] = useState<string>('20')
  const [creditScore, setCreditScore] = useState<string>('704')

  const [results, setResults] = useState({
    futureValue: 0,
    totalContributions: 0,
    totalInterest: 0,
    boostedFutureValue: 0,
    monthlyPremium: 0,
  })

  const [yearsError, setYearsError] = useState<string>('')

  useEffect(() => {
    const principal = parseFormattedNumber(initialInvestment)
    const contribution = parseFormattedNumber(monthlyContribution)
    const rate = parseFloat(annualRate) || 0
    const yrs = parseInt(years) || 0

    if (yrs <= 0 || yrs > 70) {
      setYearsError('Enter a time horizon between 1 and 70 years')
      return
    }
    setYearsError('')

    const months = yrs * 12
    const base = projectInvestment(principal, contribution, rate, months)

    // Credit score angle: show boosted projection if half the monthly interest
    // premium was redirected into investment contributions
    const creditRange = getCreditRangeInfo(parseInt(creditScore))
    const monthlyPremium = creditScoreMonthlyPremium[creditRange.label] ?? 0
    const boostedContribution = contribution + monthlyPremium / 2
    const boosted = projectInvestment(principal, boostedContribution, rate, months)

    setResults({
      futureValue: base.futureValue,
      totalContributions: base.totalContributions,
      totalInterest: base.totalInterest,
      boostedFutureValue: boosted.futureValue,
      monthlyPremium,
    })
  }, [initialInvestment, monthlyContribution, annualRate, years, creditScore])

  const creditRange = getCreditRangeInfo(parseInt(creditScore))

  // Contributions vs interest percentages for the visual bar
  const total = results.futureValue || 1
  const contributionPct = Math.round((results.totalContributions / total) * 100)
  const interestPct = 100 - contributionPct

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compound Interest Calculator
          </h1>
          <p className="text-gray-600">
            See how your savings and investments grow over time with compound interest and regular monthly contributions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Inputs ── */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <LineChart className="h-6 w-6 text-teal-600 mr-2" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-gray-900">Your Investment</h2>
            </div>

            <form className="space-y-6" role="form" aria-label="Compound interest calculation form">

              {/* Initial Investment */}
              <div>
                <label htmlFor="initial-investment" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Investment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500" aria-hidden="true">$</span>
                  <input
                    id="initial-investment"
                    name="initial-investment"
                    type="text"
                    inputMode="numeric"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(formatNumberInput(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="10,000"
                    aria-describedby="initial-help"
                  />
                </div>
                <p id="initial-help" className="mt-1 text-xs text-gray-500">
                  The amount you&apos;re starting with today (use 0 if starting from scratch)
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
                    inputMode="numeric"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(formatNumberInput(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="300"
                    aria-describedby="contribution-help"
                  />
                </div>
                <p id="contribution-help" className="mt-1 text-xs text-gray-500">
                  Added at the end of each month and compounded going forward
                </p>
              </div>

              {/* Annual Rate + Years */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="annual-rate" className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Return Rate
                  </label>
                  <div className="relative">
                    <input
                      id="annual-rate"
                      name="annual-rate"
                      type="number"
                      min="0"
                      max="30"
                      step="0.1"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(e.target.value)}
                      className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      aria-describedby="rate-help"
                    />
                    <span className="absolute right-3 top-3 text-gray-500" aria-hidden="true">%</span>
                  </div>
                  <p id="rate-help" className="mt-1 text-xs text-gray-500">
                    S&amp;P 500 ~10% historically; 7% is a common inflation-adjusted estimate
                  </p>
                </div>
                <div>
                  <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-2">
                    Years to Grow
                  </label>
                  <input
                    id="years"
                    name="years"
                    type="number"
                    min="1"
                    max="70"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    aria-describedby="years-help"
                  />
                  <p id="years-help" className="mt-1 text-xs text-gray-500">
                    Your investment time horizon
                  </p>
                </div>
              </div>
              {yearsError && (
                <p className="text-sm text-red-600 -mt-4" role="alert">{yearsError}</p>
              )}

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  aria-describedby="credit-help"
                >
                  {creditRanges.map((range) => (
                    <option key={range.min} value={getCreditRangeValue(range)}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <div className="mt-2 p-3 bg-teal-50 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-teal-600 mt-0.5 mr-2 flex-shrink-0" aria-hidden="true" />
                    <p id="credit-help" className="text-sm text-teal-800">{creditRange.description}</p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* ── Results ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Projection</h2>

              {yearsError ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Please enter a valid time horizon to see your projection.</p>
                </div>
              ) : (
                <>
                  {/* Primary number */}
                  <div className="text-center mb-8">
                    <p className="text-sm text-gray-500 mb-1">Future value in {parseInt(years)} years</p>
                    <div
                      className="text-5xl font-bold text-teal-600 mb-2"
                      aria-label={`Projected future value: ${formatCurrency(results.futureValue)}`}
                    >
                      {formatCurrency(results.futureValue)}
                    </div>
                    <p className="text-gray-500 text-sm">
                      at {parseFloat(annualRate) || 0}% annual return, compounded monthly
                    </p>
                  </div>

                  {/* Key stats */}
                  <dl className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <dt className="text-gray-700">Total Contributions</dt>
                      <dd className="font-semibold">{formatCurrency(results.totalContributions)}</dd>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <dt className="text-gray-700">Interest Earned</dt>
                      <dd className="font-semibold text-teal-600">{formatCurrency(results.totalInterest)}</dd>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <dt className="text-gray-700">Annual Return Rate</dt>
                      <dd className="font-semibold">{parseFloat(annualRate) || 0}%</dd>
                    </div>
                  </dl>

                  {/* Contributions vs Interest bar */}
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 mb-2">Contributions vs. Interest Earned</p>
                    <div className="flex rounded-full overflow-hidden h-4" aria-label={`${contributionPct}% contributions, ${interestPct}% interest earned`}>
                      <div
                        className="bg-gray-300 transition-all duration-500"
                        style={{ width: `${contributionPct}%` }}
                        title={`Contributions: ${contributionPct}%`}
                      />
                      <div
                        className="bg-teal-500 transition-all duration-500"
                        style={{ width: `${interestPct}%` }}
                        title={`Interest: ${interestPct}%`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Money you put in ({contributionPct}%)</span>
                      <span>Compound growth ({interestPct}%)</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Assumes monthly compounding with contributions added at the end of each month. Actual returns vary year to year.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Credit Score Boost Panel */}
            {!yearsError && results.monthlyPremium > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Turn Debt Interest Into Investment Growth
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Borrowers with <strong>{creditRange.label}</strong> credit pay an estimated{' '}
                  <strong className="text-red-600">${results.monthlyPremium.toLocaleString()}/month</strong> more
                  in loan interest than those with Excellent credit. High-interest debt is compound interest
                  working against you. If you redirected just half of that premium into investing, your projection grows:
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Current projection</p>
                    <p className="font-bold text-gray-800">{formatCurrency(results.futureValue)}</p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg text-center">
                    <p className="text-xs text-teal-600 mb-1">With debt savings invested</p>
                    <p className="font-bold text-teal-700">{formatCurrency(results.boostedFutureValue)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Difference:{' '}
                  <strong className="text-teal-700">
                    +{formatCurrency(results.boostedFutureValue - results.futureValue)}
                  </strong>{' '}
                  more by putting reduced debt interest to work.
                </p>
                <Link
                  href="/calculators/debt-consolidation"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                >
                  See if debt consolidation could help →
                </Link>
              </div>
            )}

            {/* Excellent credit — affirm and suggest retirement */}
            {!yearsError && results.monthlyPremium === 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-base font-semibold text-green-800 mb-2">
                  ✅ Excellent Credit — Compounding Is on Your Side
                </h2>
                <p className="text-sm text-gray-600">
                  With excellent credit you&apos;re paying minimal interest on debt, which leaves more to invest.
                  The longer your money compounds, the more powerful it becomes — see how it adds up for retirement with our{' '}
                  <Link href="/calculators/retirement" className="text-teal-600 hover:text-teal-800 underline">
                    retirement calculator
                  </Link>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Understanding section */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Understanding Compound Interest</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">What Is Compound Interest?</h3>
              <p>
                Compound interest is interest earned on both your original money and the interest it has
                already earned. Over time this snowball effect accelerates — the longer your money stays
                invested, the larger the share of growth that comes from interest rather than your own contributions.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Time Beats Timing</h3>
              <p>
                Starting early matters more than starting big. A dollar invested today has decades to compound,
                while a dollar invested later has only a few years. Even modest monthly contributions can grow
                into a substantial sum given enough time.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">The Cost of High-Interest Debt</h3>
              <p>
                Compounding works in reverse on debt. Every dollar paid in credit card or loan interest is a dollar
                that can&apos;t compound for you. Improving your credit or{' '}
                <Link href="/calculators/debt-consolidation" className="text-teal-600 hover:text-teal-800 underline">
                  consolidating debt
                </Link>{' '}
                frees up cash that can be invested instead.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Choosing a Return Rate</h3>
              <p>
                The U.S. stock market has historically returned roughly 10% per year before inflation, or about
                7% after. Conservative savers may use 4–5%; this calculator lets you model any rate so you can
                compare optimistic and cautious scenarios.
              </p>
            </div>
          </div>
        </section>

        {/* Related Calculators */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-8" aria-label="Related calculators">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Calculators</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/calculators/retirement" className="block p-4 border border-gray-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-teal-600 mb-1">Retirement Calculator</div>
              <div className="text-sm text-gray-500">Project your savings and estimated monthly income</div>
            </Link>
            <Link href="/calculators/mortgage" className="block p-4 border border-gray-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-teal-600 mb-1">Mortgage Calculator</div>
              <div className="text-sm text-gray-500">Calculate home loan payments based on your credit score</div>
            </Link>
            <Link href="/calculators/auto-loan" className="block p-4 border border-gray-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-teal-600 mb-1">Auto Loan Calculator</div>
              <div className="text-sm text-gray-500">Calculate car payments for new or used vehicles</div>
            </Link>
            <Link href="/calculators/debt-consolidation" className="block p-4 border border-gray-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-teal-600 mb-1">Debt Consolidation Calculator</div>
              <div className="text-sm text-gray-500">Free up monthly cash flow to invest more</div>
            </Link>
            <Link href="/calculators/credit-card" className="block p-4 border border-gray-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all group">
              <div className="font-medium text-gray-900 group-hover:text-teal-600 mb-1">Credit Card Payoff Calculator</div>
              <div className="text-sm text-gray-500">Pay off high-interest debt faster to redirect savings</div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
