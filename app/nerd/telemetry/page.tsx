'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { NerdTelemetry } from '@/components/nerd/NerdTelemetry'

export default function NerdTelemetryPage() {
  const { data, isLive, lastUpdated, tempHistory, turbidityHistory, doHistory } = useSharedTelemetry()

  return (
    <NerdTelemetry
      data={data}
      isLive={isLive}
      lastUpdated={lastUpdated}
      tempHistory={tempHistory}
      turbidityHistory={turbidityHistory}
      doHistory={doHistory}
    />
  )
}
