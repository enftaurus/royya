'use client'

import React, { createContext, useContext, useState } from 'react'
import { useTelemetry } from './useTelemetry'
import type { SystemData } from './api'
import type { DataPoint } from '@/components/LineChart'

interface TelemetryContextType {
  data: SystemData | null
  isLive: boolean
  isLoading: boolean
  isReconnecting: boolean
  lastUpdated: string
  error: string | null
  tempHistory: DataPoint[]
  turbidityHistory: DataPoint[]
  doHistory: DataPoint[]
  controlLoading: boolean
  feedback: { type: 'success' | 'error'; message: string } | null
  dismissFeedback: () => void
  updateMode: (mode: 'AUTO' | 'MANUAL') => Promise<void>
  updateManualAerator: (state: 'ON' | 'OFF') => Promise<void>
  refreshData: () => void
  language: 'EN' | 'తెలుగు'
  toggleLanguage: () => void
  setLanguage: (lang: 'EN' | 'తెలుగు') => void
}

const TelemetryContext = createContext<TelemetryContextType | null>(null)

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const telemetry = useTelemetry(3000)
  const [language, setLanguage] = useState<'EN' | 'తెలుగు'>('EN')

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'తెలుగు' : 'EN'))
  }

  return (
    <TelemetryContext.Provider
      value={{
        ...telemetry,
        language,
        toggleLanguage,
        setLanguage,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  )
}

export function useSharedTelemetry() {
  const ctx = useContext(TelemetryContext)
  if (!ctx) {
    throw new Error('useSharedTelemetry must be used within a TelemetryProvider')
  }
  return ctx
}
