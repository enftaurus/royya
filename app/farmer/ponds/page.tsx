'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { FarmerPonds } from '@/components/farmer/FarmerPonds'

export default function FarmerPondsPage() {
  const { data, isLive, language } = useSharedTelemetry()

  return <FarmerPonds data={data} isLive={isLive} language={language} />
}
