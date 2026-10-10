'use client'

import React from 'react'
import { TelemetryProvider, useSharedTelemetry } from '@/lib/TelemetryContext'
import { PortalShell } from '@/components/PortalShell'

function NerdShellInner({ children }: { children: React.ReactNode }) {
  const { isLive, lastUpdated, isReconnecting, refreshData, mockDoEnabled } = useSharedTelemetry()

  return (
    <PortalShell
      role="nerd"
      isLive={isLive}
      lastUpdated={lastUpdated}
      isReconnecting={isReconnecting}
      onManualRefresh={refreshData}
      mockDoEnabled={mockDoEnabled}
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
