import { NextResponse } from 'next/server'

interface CachedRates {
  rates: {
    primeRate: number
    mortgage30: number
    mortgage15: number
  }
  lastUpdated: string
  expiresAt: string
  error?: string
}

let rateCache: CachedRates | null = null

// Function to fetch rates from FRED API
async function fetchFREDRate(seriesId: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${process.env.FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
    )
    
    if (!response.ok) {
      throw new Error(`FRED API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.observations || data.observations.length === 0) {
      throw new Error('No rate data available')
    }
    
    return parseFloat(data.observations[0].value)
  } catch (error) {
    console.error(`Error fetching FRED rate for ${seriesId}:`, error)
    return null
  }
}

export async function GET(): Promise<NextResponse> {
  const now = new Date()
  
  // Check if cache is valid (24 hours)
  if (rateCache && new Date(rateCache.expiresAt) > now) {
    return NextResponse.json(rateCache)
  }

  try {
    console.log('Fetching fresh rates from FRED API...')
    
    // Fetch fresh rates from FRED
    const [primeRate, mortgage30, mortgage15] = await Promise.all([
      fetchFREDRate('DPRIME'),
      fetchFREDRate('MORTGAGE30US'),
      fetchFREDRate('MORTGAGE15US')
    ])

    const freshRates = {
      primeRate: primeRate || 8.5,
      mortgage30: mortgage30 || 7.6,
      mortgage15: mortgage15 || 7.1,
    }

    // Cache for 24 hours
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    rateCache = {
      rates: freshRates,
      lastUpdated: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    }

    console.log('Successfully cached fresh rates:', freshRates)
    return NextResponse.json(rateCache)
    
  } catch (error) {
    console.error('Error fetching rates from FRED:', error)
    
    // Return fallback rates if API fails
    const fallbackCache: CachedRates = {
      rates: { 
        primeRate: 8.5, 
        mortgage30: 7.6, 
        mortgage15: 7.1 
      },
      lastUpdated: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      error: 'Using fallback rates - FRED API unavailable'
    }
    
    rateCache = fallbackCache
    return NextResponse.json(fallbackCache)
  }
}