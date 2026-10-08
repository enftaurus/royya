'use client'

import React from 'react'
import { TelemetryProvider, useSharedTelemetry } from '@/lib/TelemetryContext'
import { PortalShell } from '@/components/PortalShell'

function NerdShellInner({ children }: { children: React.ReactNode }) {
  const { isLive, lastUpdated, isReconnecting, refreshData } = useSharedTelemetry()

  return (
    <PortalShell
      role="nerd"
      isLive={isLive}
      lastUpdated={lastUpdated}
      isReconnecting={isReconnecting}
      onManualRefresh={refreshData}
    >
      {children}
    </PortalShell>
  )
}

export default function NerdLayout({ children }: { children: React.ReactNode }) {
  return (
    <TelemetryProvider>
      <NerdShellInner>{children}</NerdShellInner>
    </TelemetryProvider>
  )
}
