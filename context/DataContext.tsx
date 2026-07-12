'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface DataContextType {
  data: any
  isExcelLoaded: boolean
  lastUpdated: string
  isLoading: boolean
  error: string | null
  loadFromExcel: (file: File) => Promise<void>
  resetToDefault: () => void
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null)
  const [isExcelLoaded, setIsExcelLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState('Using built-in data')

  const loadFromExcel = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      const { parseExcelFile } = await import('@/lib/parseExcel')
      const parsed = await parseExcelFile(file)
      setData(parsed)
      setIsExcelLoaded(true)
      setLastUpdated(`Updated from Excel: ${new Date().toLocaleString('en-IN')}`)
    } catch (err: any) {
      setError(err?.message || 'Failed to parse Excel. Check sheet names match exactly.')
      console.error('Excel parse error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetToDefault = useCallback(() => {
    setData(null)
    setIsExcelLoaded(false)
    setError(null)
    setLastUpdated('Using built-in data')
  }, [])

  return (
    <DataContext.Provider value={{
      data, isExcelLoaded, lastUpdated,
      isLoading, error, loadFromExcel, resetToDefault,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be inside DataProvider')
  return ctx
}
