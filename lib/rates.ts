export interface CreditRange {
  min: number
  max: number
  label: string
  description: string
}

export interface RateData {
  mortgageRate: number
  autoNewRate: number
  autoUsedRate: number
}

// Credit score ranges
export const creditRanges: CreditRange[] = [
  {
    min: 300,
    max: 579,
    label: "Poor (300-579)",
    description: "Limited lending options, higher rates"
  },
  {
    min: 580,
    max: 669,
    label: "Fair (580-669)",
    description: "Some lending options, above-average rates"
  },
  {
    min: 670,
    max: 739,
    label: "Good (670-739)",
    description: "Good lending options, competitive rates"
  },
  {
    min: 740,
    max: 799,
    label: "Very Good (740-799)",
    description: "Excellent lending options, good rates"
  },
  {
    min: 800,
    max: 850,
    label: "Excellent (800+)",
    description: "Best rates and terms available"
  }
]

// Current market rates by credit score and loan term
export const getCurrentRates = (creditScore: number, loanTermYears?: number, vehicleType?: 'new' | 'used'): RateData => {
  let baseRates: RateData
  
  if (creditScore >= 800) {
    baseRates = {
      mortgageRate: 6.75,
      autoNewRate: 5.2,
      autoUsedRate: 6.8
    }
  } else if (creditScore >= 740) {
    baseRates = {
      mortgageRate: 7.1,
      autoNewRate: 6.1,
      autoUsedRate: 8.2
    }
  } else if (creditScore >= 670) {
    baseRates = {
      mortgageRate: 7.6,
      autoNewRate: 8.4,
      autoUsedRate: 11.1
    }
  } else if (creditScore >= 580) {
    baseRates = {
      mortgageRate: 8.8,
      autoNewRate: 12.8,
      autoUsedRate: 16.9
    }
  } else {
    baseRates = {
      mortgageRate: 10.5,
      autoNewRate: 18.2,
      autoUsedRate: 22.1
    }
  }

  // Apply term-based adjustments for mortgages
  if (loanTermYears && !vehicleType) {
    let termAdjustment = 0
    
    if (loanTermYears === 15) {
      termAdjustment = -0.5  // 15-year mortgages get 0.5% lower rate
    } else if (loanTermYears === 20) {
      termAdjustment = -0.25 // 20-year mortgages get 0.25% lower rate
    } else if (loanTermYears === 25) {
      termAdjustment = -0.1  // 25-year mortgages get 0.1% lower rate
    } else if (loanTermYears === 30) {
      termAdjustment = 0     // 30-year is the base rate
    }
    
    baseRates.mortgageRate += termAdjustment
  }

  // Apply term-based adjustments for auto loans
  if (loanTermYears && vehicleType) {
    let autoTermAdjustment = 0
    
    if (loanTermYears <= 3) {
      autoTermAdjustment = -0.3  // 2-3 year auto loans get lower rates
    } else if (loanTermYears === 4) {
      autoTermAdjustment = -0.15 // 4-year loans get slightly lower rates
    } else if (loanTermYears === 5) {
      autoTermAdjustment = 0     // 5-year is the base rate
    } else if (loanTermYears === 6) {
      autoTermAdjustment = 0.25  // 6-year loans get higher rates
    } else if (loanTermYears >= 7) {
      autoTermAdjustment = 0.5   // 7+ year loans get much higher rates
    }
    
    baseRates.autoNewRate += autoTermAdjustment
    baseRates.autoUsedRate += autoTermAdjustment
  }

  return baseRates
}

// Get credit range info for a specific score
export const getCreditRangeInfo = (creditScore: number): CreditRange => {
  return creditRanges.find(range => 
    creditScore >= range.min && creditScore <= range.max
  ) || creditRanges[0]
}

// Get the middle value for a credit range (used for dropdown values)
export const getCreditRangeValue = (range: CreditRange): number => {
  return Math.floor((range.min + range.max) / 2)
}

// Calculate monthly payment for loans
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  termInYears: number
): number => {
  const monthlyRate = annualRate / 100 / 12
  const numberOfPayments = termInYears * 12
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments
  }
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  
  return monthlyPayment
}

// Calculate total interest paid over loan term
export const calculateTotalInterest = (
  monthlyPayment: number,
  termInYears: number,
  principal: number
): number => {
  return (monthlyPayment * termInYears * 12) - principal
}