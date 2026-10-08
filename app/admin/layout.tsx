'use client'

import React from 'react'
import { TelemetryProvider, useSharedTelemetry } from '@/lib/TelemetryContext'
import { PortalShell } from '@/components/PortalShell'

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const { isLive, lastUpdated, isReconnecting, refreshData } = useSharedTelemetry()

  return (
    <PortalShell
      role="admin"
      isLive={isLive}
      lastUpdated={lastUpdated}
      isReconnecting={isReconnecting}
      onManualRefresh={refreshData}
    >
      {children}
    </PortalShell>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <TelemetryProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </TelemetryProvider>
  )
}
