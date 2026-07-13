'use client'

import React, {
  createContext, useContext, useState,
  useCallback, useEffect
} from 'react'

interface Version {
  timestamp: string
  label: string
  uploadedAt: string
}

interface DataContextType {
  data: any
  isExcelLoaded: boolean
  lastUpdated: string
  isLoading: boolean
  uploadError: string | null
  versions: Version[]
  activeVersion: string | null
  loadFromExcel: (file: File, password: string) => Promise<void>
  loadVersion: (timestamp: string) => Promise<void>
  loadLatest: () => Promise<void>
  resetToDefault: () => void
  deleteVersion: (timestamp: string, password: string) => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null)
  const [isExcelLoaded, setIsExcelLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState('Loading...')
  const [versions, setVersions] = useState<Version[]>([])
  const [activeVersion, setActiveVersion] = useState<string | null>(null)

  const fetchVersions = useCallback(async () => {
    try {
      const res = await fetch('/api/versions')
      const json = await res.json()
      setVersions(json.versions || [])
    } catch {
      setVersions([])
    }
  }, [])

  const loadLatest = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/data')
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setIsExcelLoaded(true)
        setLastUpdated(json.label || json.timestamp)
        setActiveVersion(null)
      } else {
        setData(null)
        setIsExcelLoaded(false)
        setLastUpdated('Using built-in data')
      }
    } catch {
      setData(null)
      setIsExcelLoaded(false)
      setLastUpdated('Using built-in data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadVersion = useCallback(async (timestamp: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/data?version=${encodeURIComponent(timestamp)}`
      )
      const json = await res.json()
      if (json.data) {
        setData(json.data)
        setIsExcelLoaded(true)
        setLastUpdated(json.label || json.timestamp)
        setActiveVersion(timestamp)
      }
    } catch {
      setUploadError('Failed to load version')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadFromExcel = useCallback(
    async (file: File, password: string) => {
      setIsLoading(true)
      setUploadError(null)
      try {
        const { parseExcelFile } = await import('@/lib/parseExcel')
        const parsed = await parseExcelFile(file)

        const label = `${file.name} — ${new Date().toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true,
        })}`

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: parsed, password, label }),
        })

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || 'Upload failed')
        }

        setData(parsed)
        setIsExcelLoaded(true)
        setLastUpdated(result.label)
        setActiveVersion(null)
        await fetchVersions()

      } catch (err: any) {
        setUploadError(err.message || 'Upload failed')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchVersions]
  )

  const resetToDefault = useCallback(() => {
    setData(null)
    setIsExcelLoaded(false)
    setLastUpdated('Using built-in data')
    setUploadError(null)
    setActiveVersion(null)
  }, [])

  const deleteVersion = useCallback(
    async (timestamp: string, password: string) => {
      const res = await fetch('/api/delete-version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, password }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Delete failed')

      // If deleted version was active, go back to latest
      if (activeVersion === timestamp) {
        await loadLatest()
      }
      // Refresh versions list
      await fetchVersions()
    },
    [activeVersion, loadLatest, fetchVersions]
  )

  useEffect(() => {
    loadLatest()
    fetchVersions()
  }, [loadLatest, fetchVersions])

  return (
    <DataContext.Provider value={{
      data, isExcelLoaded, lastUpdated,
      isLoading, uploadError, versions,
      activeVersion, loadFromExcel,
      loadVersion, loadLatest, resetToDefault,
      deleteVersion,
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
