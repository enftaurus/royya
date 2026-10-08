'use client'

import React from 'react'
import { useSharedTelemetry } from '@/lib/TelemetryContext'
import { FarmerSettings } from '@/components/farmer/FarmerSettings'

export default function FarmerSettingsPage() {
  const { language, setLanguage } = useSharedTelemetry()

  return <FarmerSettings language={language} onLanguageChange={setLanguage} />
}
