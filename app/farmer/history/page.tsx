'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { FarmerHistory } from '@/components/farmer/FarmerHistory'

export default function FarmerHistoryPage() {
  const { tempHistory, turbidityHistory, doHistory, language } = useSharedTelemetry()

  return (
    <FarmerHistory
      tempHistory={tempHistory}
      turbidityHistory={turbidityHistory}
      doHistory={doHistory}
      language={language}
    />
  )
}
