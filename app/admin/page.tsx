'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { AdminOverview } from '@/components/admin/AdminOverview'

export default function AdminOverviewPage() {
  const { data, isLive, lastUpdated } = useSharedTelemetry()

  return <AdminOverview data={data} isLive={isLive} lastUpdated={lastUpdated} />
}
