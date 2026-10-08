'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { AdminPonds } from '@/components/admin/AdminPonds'

export default function AdminPondsPage() {
  const { data, isLive } = useSharedTelemetry()

  return <AdminPonds data={data} isLive={isLive} />
}
