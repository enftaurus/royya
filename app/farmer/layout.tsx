'use client'

import React from 'react'
import { TelemetryProvider, useSharedTelemetry } from '@/lib/TelemetryContext'
import { PortalShell } from '@/components/PortalShell'

function FarmerShellInner({ children }: { children: React.ReactNode }) {
  const {
    isLive,
    lastUpdated,
    isReconnecting,
    refreshData,
    language,
    toggleLanguage,
    mockDoEnabled,
  } = useSharedTelemetry()

  return (
    <PortalShell
      role="farmer"
      isLive={isLive}
      lastUpdated={lastUpdated}
      isReconnecting={isReconnecting}
      onManualRefresh={refreshData}
      language={language}
      onLanguageToggle={toggleLanguage}
      mockDoEnabled={mockDoEnabled}
    >
      {children}
    </PortalShell>
  )
}

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <TelemetryProvider>
      <FarmerShellInner>{children}</FarmerShellInner>
    </TelemetryProvider>
  )
}
