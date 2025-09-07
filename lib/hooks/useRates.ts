'use client'

import { useState, useEffect } from 'react'

interface Rates {
  primeRate: number
  mortgage30: number
  mortgage15: number
}

interface UseRatesReturn {
  rates: Rates | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useRates(): UseRatesReturn {
  const [rates, setRates] = useState<Rates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRates = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/rates')
      
      if (!response.ok) {
        throw new Error('Failed to fetch rates')
      }
      
      const data = await response.json()
      setRates(data.rates)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Error fetching rates:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  return { rates, loading, error, refetch: fetchRates }
}