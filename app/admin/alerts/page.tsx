'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { AdminAlerts } from '@/components/admin/AdminAlerts'

export default function AdminAlertsPage() {
  const { data, isLive } = useSharedTelemetry()

  return <AdminAlerts data={data} isLive={isLive} />
}
