'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Leaf, LogOut, Radio, User, AlertCircle, RefreshCw } from 'lucide-react'
import { getCurrentUser, logout, getPortalRoute, type Role, type AuthUser } from '@/lib/auth'

interface PortalShellProps {
  role: Role
  children: React.ReactNode
  isLive?: boolean
  lastUpdated?: string
  isReconnecting?: boolean
  onManualRefresh?: () => void
  language?: 'EN' | 'తెలుగు'
  onLanguageToggle?: () => void
  mockDoEnabled?: boolean
}

interface NavItem {
  label: string
  labelTe?: string
  href: string
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  farmer: [
    { label: 'Overview', labelTe: 'అవలోకనం', href: '/farmer' },
    { label: 'Ponds', labelTe: 'చెరువులు', href: '/farmer/ponds' },
    { label: 'Alerts', labelTe: 'హెచ్చరికలు', href: '/farmer/alerts' },
    { label: 'History', labelTe: 'చరిత్ర', href: '/farmer/history' },
    { label: 'Settings', labelTe: 'సెట్టింగ్‌లు', href: '/farmer/settings' },
  ],
  admin: [
    { label: 'Overview', href: '/admin' },
    { label: 'Farms', href: '/admin/farms' },
    { label: 'Ponds', href: '/admin/ponds' },
    { label: 'Devices', href: '/admin/devices' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Alerts', href: '/admin/alerts' },
    { label: 'Settings', href: '/admin/settings' },
  ],
  nerd: [
    { label: 'Overview', href: '/nerd' },
    { label: 'Devices', href: '/nerd/devices' },
    { label: 'Telemetry', href: '/nerd/telemetry' },
    { label: 'Diagnostics', href: '/nerd/diagnostics' },
    { label: 'Logs', href: '/nerd/logs' },
  ],
}

export function PortalShell({
  role,
  children,
  isLive = true,
  lastUpdated,
  isReconnecting = false,
  onManualRefresh,
  language = 'EN',
  onLanguageToggle,
  mockDoEnabled = false,
}: PortalShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.replace('/login')
      return
    }
    if (currentUser.role !== role) {
      router.replace(getPortalRoute(currentUser.role))
      return
    }
    setUser(currentUser)
    setAuthChecked(true)
  }, [role, router])

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  const items = NAV_ITEMS[role] || []
  const roleTitle =
    role === 'farmer'
      ? (language === 'తెలుగు' ? 'రైతు పోర్టల్' : 'Farmer portal')
      : role === 'admin'
      ? 'Admin portal'
      : 'Nerd console'

  const sidebarCategory =
    role === 'farmer'
      ? (language === 'తెలుగు' ? 'నా చెరువు' : 'My Farm')
      : role === 'admin'
      ? 'Operations'
      : 'Telemetry & IoT'

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f0] text-[#153b35]">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-sm border border-[#dce5d9]">
          <span className="flex h-8 w-8 animate-spin items-center justify-center rounded-full border-2 border-[#153b35] border-t-transparent" />
          <p className="text-sm font-semibold">Verifying session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f6f0] text-[#153b35]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#dce5d9] bg-white/95 px-4 py-3 sm:px-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href={getPortalRoute(role)} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5f36d] text-[#153b35] shadow-xs">
              <Leaf size={18} />
            </span>
            <span className="text-sm font-black tracking-[0.18em] text-[#153b35]">ROYYA WATCH</span>
          </Link>
          <span className="hidden rounded-full bg-[#eaf6df] px-3 py-1 text-xs font-bold text-[#5c8e33] md:inline-block">
            {roleTitle}
          </span>
        </div>

        {/* Status Indicators & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live vs Offline pill */}
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
              isLive
                ? 'bg-[#eaf6df] text-[#5c8e33] border border-[#cfe6bf]'
                : 'bg-[#fff0e5] text-[#b55835] border border-[#f4cbb8]'
            }`}
            title={isLive ? 'Connected to FastAPI backend' : 'Backend is currently offline or unreachable'}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isLive ? 'bg-[#7eb548] animate-pulse' : 'bg-[#d9534f]'
              }`}
            />
            <span className="hidden sm:inline">
              {isLive ? 'LIVE' : 'OFFLINE'}
            </span>
            <span className="sm:hidden">{isLive ? 'LIVE' : 'OFF'}</span>
            {lastUpdated && isLive && (
              <span className="hidden lg:inline text-[10px] text-[#788d81] font-normal border-l border-[#cfe6bf] pl-2">
                {lastUpdated}
              </span>
            )}
          </div>

          {/* Mock DO indicator badge */}
          {mockDoEnabled && (
            <div
              className="flex items-center gap-1.5 rounded-full bg-[#f3e8ff] border border-[#d8b4fe] px-2.5 py-1 text-xs font-black text-[#7e22ce] animate-pulse"
              title="DO Slider Simulation Active — Overwriting ML model prediction"
            >
              <span>●</span>
              <span className="hidden sm:inline">MOCK DO ACTIVE</span>
              <span className="sm:hidden">MOCK</span>
            </div>
          )}

          {/* Manual refresh button */}
          {onManualRefresh && (
            <button
              onClick={onManualRefresh}
              disabled={isReconnecting}
              title="Refresh telemetry"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8e2d7] bg-white text-[#5c8e33] hover:bg-[#f2f7ef] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={isReconnecting ? 'animate-spin' : ''} />
            </button>
          )}

          {/* Language Toggle for Farmer */}
          {role === 'farmer' && onLanguageToggle && (
            <button
              onClick={onLanguageToggle}
              className="rounded-full border border-[#d8e2d7] bg-white px-3 py-1.5 text-xs font-bold text-[#153b35] hover:bg-[#f6f9f4] transition-colors"
            >
              {language === 'EN' ? 'తెలుగు' : 'English'}
            </button>
          )}

          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#d8e2d7] bg-[#f9faf7] px-3 py-1 text-xs">
            <User size={13} className="text-[#6d8176]" />
            <span className="font-semibold text-[#153b35] max-w-[120px] truncate">
              {user?.name}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-[#d8e2d7] bg-white px-3 py-1.5 text-xs font-bold text-[#b55835] hover:bg-[#fff5f0] transition-colors"
            title="Log out"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Shell */}
      <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden min-h-[calc(100vh-61px)] w-60 border-r border-[#dce5d9] bg-[#eef4eb] p-5 lg:block">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a9d90]">
            {sidebarCategory}
          </p>
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href
              const label =
                role === 'farmer' && language === 'తెలుగు' && item.labelTe
                  ? item.labelTe
                  : item.label
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#153b35] text-white shadow-xs'
                      : 'text-[#5d7367] hover:bg-[#e1ece0] hover:text-[#153b35]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Backend Info Footer in Sidebar */}
          <div className="mt-12 rounded-2xl border border-[#d5e0d3] bg-white/70 p-3.5 text-[11px] text-[#6d8176]">
            <p className="font-bold text-[#153b35] flex items-center gap-1.5">
              <Radio size={12} className="text-[#80bd48]" />
              API Gateway
            </p>
            <p className="mt-1 font-mono text-[10px] truncate text-[#788d81]">
              10.138.215.133:8000
            </p>
            <p className="mt-1 text-[10px]">
              {isLive ? '✓ Operational' : '✗ Offline / Retrying'}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {/* Mobile Navigation Dropdown */}
          <div className="mb-5 lg:hidden">
            <label htmlFor="portal-mobile-nav" className="sr-only">
              Navigation
            </label>
            <select
              id="portal-mobile-nav"
              value={pathname}
              onChange={(e) => router.push(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2d7] bg-white px-4 py-3 text-sm font-bold text-[#153b35] shadow-xs"
            >
              {items.map((item) => (
                <option key={item.href} value={item.href}>
                  {role === 'farmer' && language === 'తెలుగు' && item.labelTe
                    ? item.labelTe
                    : item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Offline Warning Banner */}
          {!isLive && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f2c5af] bg-[#fff2ea] p-4 text-[#a95232]">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0 text-[#d9534f]" />
                <div>
                  <p className="font-bold text-sm">Backend unavailable</p>
                  <p className="text-xs text-[#8c4f3a]">
                    Cannot connect to FastAPI at http://10.138.215.133:8000. Ensure the backend server is running.
                  </p>
                </div>
              </div>
              {onManualRefresh && (
                <button
                  onClick={onManualRefresh}
                  className="rounded-full bg-[#153b35] px-4 py-2 text-xs font-bold text-white hover:bg-[#1a4841]"
                >
                  Retry connection
                </button>
              )}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
