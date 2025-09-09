'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calculator, CreditCard, DollarSign, TrendingDown, Plus, Trash2, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Types
interface Debt {
  id: string
  name: string
  balance: number
  interestRate: number
  monthlyPayment: number
  annualFee: number
}


interface CalculationResult {
  currentScenario: {
    totalMonthlyPayment: number
    totalBalance: number
    weightedAvgRate: number
    totalPayoffTime: number
    totalInterest: number
    totalCost: number
  }
  consolidatedScenario: {
    monthlyPayment: number
    totalInterest: number
    totalCost: number
    payoffTime: number
    apr: number
  }
  savings: {
    monthlyPayment: number
    totalInterest: number
    totalCost: number
    timeMonths: number
  }
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount))
}

const formatNumber = (value: string): string => {
  const numericValue = value.replace(/[^\d.]/g, '')
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('')
  }
  if (parts[0]) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return parts.join('.')
}

const parseNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0
}

const generateId = (): string => Math.random().toString(36).substr(2, 9)

// Credit score to interest rate mapping
const getCreditScoreRates = (creditScore: string): { min: number; max: number } => {
  switch (creditScore) {
    case '800+': return { min: 6.0, max: 12.0 }
    case '750-799': return { min: 8.0, max: 14.0 }
    case '700-749': return { min: 10.0, max: 16.0 }
    case '650-699': return { min: 12.0, max: 18.0 }
    case '600-649': return { min: 15.0, max: 22.0 }
    case '550-599': return { min: 18.0, max: 25.0 }
    case 'below-550': return { min: 22.0, max: 30.0 }
    default: return { min: 10.0, max: 16.0 }
  }
}

// Custom hooks
const useDebounced = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Calculation functions
const calculateDebtPayoff = (balance: number, rate: number, payment: number): { months: number; totalInterest: number } => {
  if (balance <= 0 || payment <= 0) return { months: 0, totalInterest: 0 }
  
  const monthlyRate = rate / 100 / 12
  const monthlyInterest = balance * monthlyRate
  
  if (payment <= monthlyInterest) {
    return { months: Infinity, totalInterest: Infinity }
  }
  
  const months = -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate)
  const totalInterest = (payment * months) - balance
  
  return { months, totalInterest }
}

const calculateConsolidation = (
  debts: Debt[],
  creditScore: string,
  loanTerm: number,
  originationFeePercent: number
): CalculationResult | null => {
  if (debts.length === 0) return null
  
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0)
  const totalMonthlyPayment = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
  const totalAnnualFees = debts.reduce((sum, debt) => sum + debt.annualFee, 0)
  
  // Calculate weighted average interest rate
  const weightedAvgRate = debts.reduce((sum, debt) => 
    sum + (debt.interestRate * debt.balance), 0
  ) / totalBalance
  
  // Calculate current scenario
  let totalInterest = 0
  let maxPayoffTime = 0
  
  debts.forEach(debt => {
    const result = calculateDebtPayoff(debt.balance, debt.interestRate, debt.monthlyPayment)
    if (result.months === Infinity) {
      maxPayoffTime = Infinity
      totalInterest = Infinity
    } else if (maxPayoffTime !== Infinity) {
      maxPayoffTime = Math.max(maxPayoffTime, result.months)
      totalInterest += result.totalInterest
    }
  })
  
  // Estimate consolidation loan rate
  const rateRange = getCreditScoreRates(creditScore)
  const estimatedRate = (rateRange.min + rateRange.max) / 2
  const originationFee = totalBalance * (originationFeePercent / 100)
  const loanAmount = totalBalance + originationFee
  
  // Calculate consolidation loan payment
  const monthlyRate = estimatedRate / 100 / 12
  const consolidatedPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
  const consolidatedTotalCost = consolidatedPayment * loanTerm
  const consolidatedInterest = consolidatedTotalCost - totalBalance
  
  // Calculate APR including fees
  const apr = ((consolidatedTotalCost / totalBalance) ** (1/loanTerm*12) - 1) * 12 * 100
  
  return {
    currentScenario: {
      totalMonthlyPayment,
      totalBalance,
      weightedAvgRate,
      totalPayoffTime: maxPayoffTime,
      totalInterest: totalInterest + (totalAnnualFees * (maxPayoffTime / 12)),
      totalCost: totalBalance + totalInterest + (totalAnnualFees * (maxPayoffTime / 12))
    },
    consolidatedScenario: {
      monthlyPayment: consolidatedPayment,
      totalInterest: consolidatedInterest,
      totalCost: consolidatedTotalCost,
      payoffTime: loanTerm,
      apr
    },
    savings: {
      monthlyPayment: totalMonthlyPayment - consolidatedPayment,
      totalInterest: totalInterest - consolidatedInterest,
      totalCost: (totalBalance + totalInterest) - consolidatedTotalCost,
      timeMonths: maxPayoffTime - loanTerm
    }
  }
}

// Components
const DebtInputForm = ({ 
  debts, 
  setDebts, 
  creditScore, 
  setCreditScore,
  loanTerm,
  setLoanTerm,
  originationFee,
  setOriginationFee 
}: {
  debts: Debt[]
  setDebts: (debts: Debt[]) => void
  creditScore: string
  setCreditScore: (score: string) => void
  loanTerm: number
  setLoanTerm: (term: number) => void
  originationFee: number
  setOriginationFee: (fee: number) => void
}) => {
  const addDebt = () => {
    setDebts([...debts, {
      id: generateId(),
      name: `Debt ${debts.length + 1}`,
      balance: 0,
      interestRate: 0,
      monthlyPayment: 0,
      annualFee: 0
    }])
  }

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id))
  }

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ))
  }

  const creditScoreOptions = [
    { value: '800+', label: '800+ (Excellent)' },
    { value: '750-799', label: '750-799 (Very Good)' },
    { value: '700-749', label: '700-749 (Good)' },
    { value: '650-699', label: '650-699 (Fair)' },
    { value: '600-649', label: '600-649 (Poor)' },
    { value: '550-599', label: '550-599 (Very Poor)' },
    { value: 'below-550', label: 'Below 550 (Bad)' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-semibold text-gray-900">Debt Information</h2>
      </div>

      <div className="space-y-6">
        {/* Credit Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Score Range
          </label>
          <select
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {creditScoreOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consolidation Loan Term: {loanTerm} months ({Math.round(loanTerm / 12 * 10) / 10} years)
          </label>
          <input
            type="range"
            min="12"
            max="84"
            step="12"
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 year</span>
            <span>7 years</span>
          </div>
        </div>

        {/* Origination Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Origination Fee: {originationFee}%
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={originationFee}
            onChange={(e) => setOriginationFee(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>5%</span>
          </div>
        </div>

        {/* Debts */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Current Debts</h3>
            <button
              onClick={addDebt}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Debt
            </button>
          </div>

          {debts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No debts added yet. Click &ldquo;Add Debt&rdquo; to get started.</p>
            </div>
          )}

          {debts.map((debt) => (
            <div key={debt.id} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <input
                  type="text"
                  value={debt.name}
                  onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                  className="text-lg font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  placeholder="Debt name"
                />
                {debts.length > 1 && (
                  <button
                    onClick={() => removeDebt(debt.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={debt.balance ? formatNumber(debt.balance.toString()) : ''}
                      onChange={(e) => updateDebt(debt.id, 'balance', parseNumber(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={debt.interestRate || ''}
                      onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                      className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Payment
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={debt.monthlyPayment ? formatNumber(debt.monthlyPayment.toString()) : ''}
                      onChange={(e) => updateDebt(debt.id, 'monthlyPayment', parseNumber(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      value={debt.annualFee ? formatNumber(debt.annualFee.toString()) : ''}
                      onChange={(e) => updateDebt(debt.id, 'annualFee', parseNumber(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ComparisonCharts = ({ result }: { result: CalculationResult | null }) => {
  if (!result) return null

  const { currentScenario, consolidatedScenario } = result

  // Prepare data for charts
  const comparisonData = [
    {
      category: 'Monthly Payment',
      current: currentScenario.totalMonthlyPayment,
      consolidated: consolidatedScenario.monthlyPayment,
    },
    {
      category: 'Total Interest',
      current: isFinite(currentScenario.totalInterest) ? currentScenario.totalInterest : 0,
      consolidated: consolidatedScenario.totalInterest,
    },
    {
      category: 'Total Cost',
      current: isFinite(currentScenario.totalCost) ? currentScenario.totalCost : 0,
      consolidated: consolidatedScenario.totalCost,
    }
  ]

  // Pie chart data for current debt breakdown
  const pieData = [
    { name: 'Principal', value: currentScenario.totalBalance, fill: '#3B82F6' },
    { name: 'Interest', value: isFinite(currentScenario.totalInterest) ? currentScenario.totalInterest : 0, fill: '#EF4444' }
  ]

  // Timeline comparison data
  const timelineData = [
    { scenario: 'Current Debts', months: isFinite(currentScenario.totalPayoffTime) ? currentScenario.totalPayoffTime : 0 },
    { scenario: 'Consolidated', months: consolidatedScenario.payoffTime }
  ]

  const COLORS = ['#3B82F6', '#10B981']

  return (
    <div className="space-y-8">
      {/* Bar Chart Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Bar dataKey="current" fill="#EF4444" name="Current" />
            <Bar dataKey="consolidated" fill="#10B981" name="Consolidated" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={false}
              >
                {pieData.map((entry, entryIndex) => (
                  <Cell key={`cell-${entryIndex}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Timeline Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payoff Timeline</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={timelineData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => `${Math.round(value)} mo`} />
            <YAxis type="category" dataKey="scenario" width={100} />
            <Tooltip formatter={(value: number) => [`${Math.round(value)} months`, '']} />
            <Bar dataKey="months" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const ResultsDisplay = ({ result }: { result: CalculationResult | null }) => {
  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Results</h2>
        <div className="text-center py-12">
          <TrendingDown className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Add your debts to see consolidation analysis</p>
        </div>
      </div>
    )
  }

  const { currentScenario, consolidatedScenario, savings } = result

  const formatTime = (months: number) => {
    if (!isFinite(months)) return 'Never'
    const years = Math.floor(months / 12)
    const remainingMonths = Math.round(months % 12)
    if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`
    return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Consolidation Analysis</h2>

      {/* Key Savings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {savings.monthlyPayment >= 0 ? '+' : ''}{formatCurrency(savings.monthlyPayment)}
          </div>
          <div className="text-sm text-green-700">Monthly Payment Change</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <TrendingDown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(Math.abs(savings.totalInterest))}
          </div>
          <div className="text-sm text-blue-700">
            Interest {savings.totalInterest >= 0 ? 'Savings' : 'Increase'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {savings.timeMonths >= 0 ? formatTime(savings.timeMonths) : `+${formatTime(Math.abs(savings.timeMonths))}`}
          </div>
          <div className="text-sm text-purple-700">
            Time {savings.timeMonths >= 0 ? 'Saved' : 'Added'}
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Scenario */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Debts</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600">Total Balance:</dt>
              <dd className="font-semibold">{formatCurrency(currentScenario.totalBalance)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Monthly Payment:</dt>
              <dd className="font-semibold">{formatCurrency(currentScenario.totalMonthlyPayment)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Weighted Avg Rate:</dt>
              <dd className="font-semibold">{currentScenario.weightedAvgRate.toFixed(2)}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Payoff Time:</dt>
              <dd className="font-semibold">{formatTime(currentScenario.totalPayoffTime)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Total Interest:</dt>
              <dd className="font-semibold text-red-600">
                {formatCurrency(isFinite(currentScenario.totalInterest) ? currentScenario.totalInterest : 0)}
              </dd>
            </div>
            <div className="flex justify-between border-t pt-2">
              <dt className="font-medium">Total Cost:</dt>
              <dd className="font-bold text-lg">
                {formatCurrency(isFinite(currentScenario.totalCost) ? currentScenario.totalCost : 0)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Consolidated Scenario */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consolidated Loan</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-600">Loan Amount:</dt>
              <dd className="font-semibold">{formatCurrency(currentScenario.totalBalance)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Monthly Payment:</dt>
              <dd className="font-semibold">{formatCurrency(consolidatedScenario.monthlyPayment)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Estimated APR:</dt>
              <dd className="font-semibold">{consolidatedScenario.apr.toFixed(2)}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Payoff Time:</dt>
              <dd className="font-semibold">{formatTime(consolidatedScenario.payoffTime)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Total Interest:</dt>
              <dd className="font-semibold text-red-600">{formatCurrency(consolidatedScenario.totalInterest)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2">
              <dt className="font-medium">Total Cost:</dt>
              <dd className="font-bold text-lg">{formatCurrency(consolidatedScenario.totalCost)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">💡 Our Recommendation</h4>
        <p className="text-sm text-gray-700">
          {savings.totalInterest > 0 
            ? `Debt consolidation could save you ${formatCurrency(savings.totalInterest)} in interest and reduce your monthly payment by ${formatCurrency(Math.abs(savings.monthlyPayment))}. Consider applying for a personal loan with rates between ${getCreditScoreRates(result.currentScenario.totalBalance.toString()).min}%-${getCreditScoreRates(result.currentScenario.totalBalance.toString()).max}%.`
            : `While consolidation would extend your payoff time, it could lower your monthly payment by ${formatCurrency(Math.abs(savings.monthlyPayment))}. Consider whether the monthly payment relief is worth the additional interest cost of ${formatCurrency(Math.abs(savings.totalInterest))}.`
          }
        </p>
      </div>
    </div>
  )
}

const EmailCapture = ({ onSubmit }: { onSubmit: (email: string) => void }) => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onSubmit(email)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 rounded-lg p-6 text-center">
        <div className="text-green-600 mb-2">✓ Thank you!</div>
        <p className="text-sm text-green-700">We&apos;ll send you personalized debt consolidation tips and lender recommendations.</p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Mail className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-blue-900">Get Personalized Recommendations</h3>
      </div>
      <p className="text-sm text-blue-700 mb-4">
        Enter your email to receive a detailed consolidation report with lender recommendations based on your credit score.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Report
        </button>
      </form>
    </div>
  )
}

// Main Component
export default function DebtConsolidationCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    {
      id: generateId(),
      name: 'Credit Card 1',
      balance: 8000,
      interestRate: 24.99,
      monthlyPayment: 250,
      annualFee: 95
    },
    {
      id: generateId(),
      name: 'Credit Card 2', 
      balance: 4500,
      interestRate: 21.24,
      monthlyPayment: 150,
      annualFee: 0
    }
  ])

  const [creditScore, setCreditScore] = useState('700-749')
  const [loanTerm, setLoanTerm] = useState(60) // 5 years
  const [originationFee, setOriginationFee] = useState(2.5)
  const [showCharts, setShowCharts] = useState(false)

  // Debounced values for performance
  const debouncedDebts = useDebounced(debts, 300)
  const debouncedCreditScore = useDebounced(creditScore, 100)
  const debouncedLoanTerm = useDebounced(loanTerm, 100)
  const debouncedOriginationFee = useDebounced(originationFee, 100)

  // Memoized calculation
  const result = useMemo(() => 
    calculateConsolidation(debouncedDebts, debouncedCreditScore, debouncedLoanTerm, debouncedOriginationFee),
    [debouncedDebts, debouncedCreditScore, debouncedLoanTerm, debouncedOriginationFee]
  )

  const handleEmailSubmit = (email: string) => {
    // Track email capture for lead generation
    if (typeof window !== 'undefined' && 'gtag' in window) {
      const gtag = (window as { gtag: (action: string, event: string, parameters?: Record<string, unknown>) => void }).gtag
      gtag('event', 'email_capture', {
        event_category: 'lead_generation',
        event_label: 'debt_consolidation_calculator',
        custom_parameters: {
          email: email,
          total_debt: debts.reduce((sum, debt) => sum + debt.balance, 0),
          credit_score: creditScore
        }
      })
    }
  }

  // Structured data for SEO
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Debt Consolidation Calculator",
    "description": "Calculate debt consolidation savings with personalized interest rates based on credit score. Compare before and after scenarios to find the best consolidation loan option.",
    "url": "https://financial-calc.com/calculators/debt-consolidation",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Multiple debt consolidation analysis",
      "Credit score-based rate estimation", 
      "Before and after payment comparison",
      "Interactive charts and visualizations",
      "Origination fee calculations",
      "Personalized loan recommendations",
      "Total interest and cost savings calculation"
    ]
  }), [])

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [structuredData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Debt Consolidation Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare your current debts with a consolidation loan to see potential savings. Get personalized rates based on your credit score.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <DebtInputForm
              debts={debts}
              setDebts={setDebts}
              creditScore={creditScore}
              setCreditScore={setCreditScore}
              loanTerm={loanTerm}
              setLoanTerm={setLoanTerm}
              originationFee={originationFee}
              setOriginationFee={setOriginationFee}
            />
            
            {/* Email Capture */}
            <div className="mt-6">
              <EmailCapture onSubmit={handleEmailSubmit} />
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-8">
            <ResultsDisplay result={result} />

            {/* Charts Toggle */}
            {result && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Visual Comparison</h3>
                  {showCharts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                
                {showCharts && (
                  <div className="mt-6">
                    <ComparisonCharts result={result} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Educational Content */}
        <section className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Debt Consolidation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What is Debt Consolidation?</h3>
              <p className="text-sm text-gray-600">
                Debt consolidation combines multiple debts into a single loan with one monthly payment, potentially at a lower interest rate.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Benefits</h3>
              <p className="text-sm text-gray-600">
                Simplifies payments, may reduce interest rates, can lower monthly payments, and helps establish a clear payoff timeline.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Credit Score Impact</h3>
              <p className="text-sm text-gray-600">
                Your credit score determines loan rates. Higher scores (750+) typically qualify for the best rates (6-12% APR).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Origination Fees</h3>
              <p className="text-sm text-gray-600">
                Many lenders charge 1-5% origination fees. These are added to your loan amount and included in the APR calculation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">When to Consolidate</h3>
              <p className="text-sm text-gray-600">
                Consider consolidation if you qualify for a lower rate, want simplified payments, or need lower monthly payments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Alternatives</h3>
              <p className="text-sm text-gray-600">
                Balance transfers, debt management plans, or the debt avalanche method may be better options depending on your situation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}