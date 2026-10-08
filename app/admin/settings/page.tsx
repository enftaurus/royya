'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { AdminSettings } from '@/components/admin/AdminSettings'

export default function AdminSettingsPage() {
  const { isLive } = useSharedTelemetry()

  return <AdminSettings isLive={isLive} />
}
