'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { NerdOverview } from '@/components/nerd/NerdOverview'

export default function NerdOverviewPage() {
  const {
    data,
    isLive,
    lastUpdated,
    tempHistory,
    turbidityHistory,
    refreshData,
    mockDoEnabled,
    mockDoValue,
    updateMockDo,
    updateMode,
  } = useSharedTelemetry()

  return (
    <NerdOverview
      data={data}
      isLive={isLive}
      lastUpdated={lastUpdated}
      tempHistory={tempHistory}
      turbidityHistory={turbidityHistory}
      onRefresh={refreshData}
      mockDoEnabled={mockDoEnabled}
      mockDoValue={mockDoValue}
      onUpdateMockDo={updateMockDo}
      onUpdateMode={updateMode}
    />
  )
}
