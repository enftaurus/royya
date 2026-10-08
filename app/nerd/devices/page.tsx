'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { NerdDevices } from '@/components/nerd/NerdDevices'

export default function NerdDevicesPage() {
  const { data, isLive, lastUpdated } = useSharedTelemetry()

  return <NerdDevices data={data} isLive={isLive} lastUpdated={lastUpdated} />
}
