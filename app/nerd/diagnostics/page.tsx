'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { NerdDiagnostics } from '@/components/nerd/NerdDiagnostics'

export default function NerdDiagnosticsPage() {
  const { data, isLive, refreshData } = useSharedTelemetry()

  return <NerdDiagnostics data={data} isLive={isLive} onRefresh={refreshData} />
}
