'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { AdminDevices } from '@/components/admin/AdminDevices'

export default function AdminDevicesPage() {
  const { isLive, lastUpdated } = useSharedTelemetry()

  return <AdminDevices isLive={isLive} lastUpdated={lastUpdated} />
}
