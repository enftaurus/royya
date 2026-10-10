'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { FarmerOverview } from '@/components/farmer/FarmerOverview'

export default function FarmerOverviewPage() {
  const {
    data,
    isLive,
    tempHistory,
    turbidityHistory,
    doHistory,
    controlLoading,
    feedback,
    dismissFeedback,
    updateMode,
    updateManualAerator,
    language,
    mockDoEnabled,
    mockDoValue,
    updateMockDo,
  } = useSharedTelemetry()

  return (
    <FarmerOverview
      data={data}
      isLive={isLive}
      tempHistory={tempHistory}
      turbidityHistory={turbidityHistory}
      doHistory={doHistory}
      controlLoading={controlLoading}
      feedback={feedback}
      onDismissFeedback={dismissFeedback}
      onUpdateMode={updateMode}
      onUpdateManualAerator={updateManualAerator}
      language={language}
      mockDoEnabled={mockDoEnabled}
      mockDoValue={mockDoValue}
      onUpdateMockDo={updateMockDo}
    />
  )
}
