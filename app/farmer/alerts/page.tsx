'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { FarmerAlerts } from '@/components/farmer/FarmerAlerts'

export default function FarmerAlertsPage() {
  const { data, isLive, language } = useSharedTelemetry()

  return <FarmerAlerts data={data} isLive={isLive} language={language} />
}
