'use client'

import React from 'react'
import {
  Building2,
  Cpu,
  Layers,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Info,
  Server,
  Zap,
} from 'lucide-react'
import type { SystemData } from '@/lib/api'

interface AdminOverviewProps {
  data: SystemData | null
  isLive: boolean
  lastUpdated: string
}

export function AdminOverview({ data, isLive, lastUpdated }: AdminOverviewProps) {
  const activeAlertsCount = !isLive
    ? 1
    : data && data.dissolved_oxygen < 5.0
    ? 1
    : 0

  return (
    <div className="space-y-6">
      {/* Backend Persistence Notice */}
      <div className="rounded-2xl border border-[#dce5d9] bg-white p-4.5 flex items-start gap-3 shadow-xs">
        <Info size={20} className="text-[#5c8e33] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-[#153b35]">
            Backend Architecture Notice (FastAPI Single-Node Mode)
          </p>
          <p className="mt-0.5 text-[#6d8176] leading-relaxed">
            The active FastAPI backend currently processes single-pond telemetry and ML automation for Pond 01.
            Multi-farm persistence, device fleet provisioning, and cloud user management tables are clearly marked as{' '}
            <strong className="text-[#153b35] underline">Coming soon</strong> rather than simulating artificial database records.
          </p>
        </div>
      </div>

      {/* Cluster Operational Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Farms */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>Farms</span>
            <Building2 size={16} className="text-[#5c8e33]" />
          </div>
          <p className="text-3xl font-bold text-[#153b35]">1</p>
          <p className="mt-2 text-[10px] text-[#788d81]">
            Active Live Farm
          </p>
          <span className="mt-1 inline-block text-[10px] font-bold text-[#9a7824] bg-[#fef9e7] px-2 py-0.5 rounded-full">
            Multi-farm DB: Coming soon
          </span>
        </div>

        {/* Total Ponds */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>Ponds</span>
            <Layers size={16} className="text-[#2563eb]" />
          </div>
          <p className="text-3xl font-bold text-[#153b35]">1</p>
          <p className="mt-2 text-[10px] text-[#788d81]">
            Connected (Pond 01)
          </p>
          <span className="mt-1 inline-block text-[10px] font-bold text-[#9a7824] bg-[#fef9e7] px-2 py-0.5 rounded-full">
            Cluster DB: Coming soon
          </span>
        </div>

        {/* Devices Online */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>Devices Online</span>
            <Cpu size={16} className="text-[#059669]" />
          </div>
          <p className="text-3xl font-bold text-[#059669]">{isLive ? '1' : '0'}</p>
          <p className="mt-2 text-[10px] text-[#788d81]">
            ESP32-001 Streaming
          </p>
          <span className="mt-1 inline-block text-[10px] font-bold text-[#5c8e33] bg-[#eaf6df] px-2 py-0.5 rounded-full">
            {isLive ? 'Live Heartbeat' : 'Reconnecting'}
          </span>
        </div>

        {/* Devices Offline */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>Devices Offline</span>
            <Cpu size={16} className="text-[#d97706]" />
          </div>
          <p className="text-3xl font-bold text-[#b55835]">{isLive ? '0' : '1'}</p>
          <p className="mt-2 text-[10px] text-[#788d81]">
            Unresponsive Nodes
          </p>
          <span className="mt-1 inline-block text-[10px] font-bold text-[#6d8176] bg-gray-100 px-2 py-0.5 rounded-full">
            Fleet: ESP32-001
          </span>
        </div>

        {/* Active Alerts */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>Active Alerts</span>
            <AlertTriangle size={16} className="text-[#ea580c]" />
          </div>
          <p className="text-3xl font-bold text-[#ea580c]">{activeAlertsCount}</p>
          <p className="mt-2 text-[10px] text-[#788d81]">
            Real-time threshold triggers
          </p>
          <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${activeAlertsCount > 0 ? 'bg-[#fff0e5] text-[#b55835]' : 'bg-[#eaf6df] text-[#5c8e33]'}`}>
            {activeAlertsCount > 0 ? 'Requires attention' : 'All nominal'}
          </span>
        </div>
      </div>

      {/* Live Node Operations Card */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#edf1eb]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#788d81]">
              Live Farm Telemetry
            </span>
            <h3 className="text-xl font-bold text-[#153b35] mt-1">
              Kakinada Coastal Cluster · Pond 01
            </h3>
            <p className="text-xs text-[#788d81]">
              Backend Gateway: http://10.138.215.133:8000 · Last Sync: {lastUpdated || 'Never'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-bold ${
                isLive ? 'bg-[#eaf6df] text-[#5c8e33]' : 'bg-[#fff0e5] text-[#b55835]'
              }`}
            >
              {isLive ? '● Live Telemetry' : '● Offline'}
            </span>
            <span className="rounded-full bg-[#153b35] px-3.5 py-1 text-xs font-bold text-white">
              {data ? `${data.mode} MODE` : '--'}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <p className="text-xs text-[#788d81]">Water Temperature</p>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data ? data.temperature.toFixed(2) : '--'}
              <span className="text-xs font-normal text-[#788d81] ml-1">°C</span>
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <p className="text-xs text-[#788d81]">Turbidity Voltage</p>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data ? data.turbidity.toFixed(2) : '--'}
              <span className="text-xs font-normal text-[#788d81] ml-1">V</span>
            </p>
            <p className="text-[10px] text-[#8a9d90] mt-0.5">Sensor voltage</p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <p className="text-xs text-[#788d81]">Predicted DO</p>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data ? data.dissolved_oxygen.toFixed(2) : '--'}
              <span className="text-xs font-normal text-[#788d81] ml-1">mg/L</span>
            </p>
            <p className="text-[10px] text-[#8a9d90] mt-0.5">Threshold: 5.0 / 6.0</p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4">
            <p className="text-xs text-[#788d81]">Relay State</p>
            <p className="mt-2 text-2xl font-bold text-[#153b35]">
              {data ? data.aerator_state : '--'}
            </p>
            <p className="text-[10px] text-[#8a9d90] mt-0.5">GPIO 18 MOSFET</p>
          </div>
        </div>
      </div>

      {/* System Automation Rules Card */}
      <div className="rounded-3xl border border-[#1b3d36] bg-[#153b35] p-6 text-white shadow-md">
        <div className="flex items-center gap-2.5 mb-2">
          <Zap size={18} className="text-[#d5f36d]" />
          <h3 className="text-lg font-bold">FastAPI Automated Decision Rules</h3>
        </div>
        <p className="text-xs text-white/70 mb-5">
          These hysteresis parameters are enforced directly in the FastAPI backend runtime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
            <span className="text-white/50 text-[10px] uppercase font-mono">Activation Boundary</span>
            <p className="mt-1 text-sm font-bold text-[#d5f36d]">DO &lt; 5.0 mg/L</p>
            <p className="mt-2 text-[11px] text-white/70">
              Backend automatically commands Aerator ON to prevent hypoxia in pond.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
            <span className="text-white/50 text-[10px] uppercase font-mono">Deactivation Boundary</span>
            <p className="mt-1 text-sm font-bold text-[#d5f36d]">DO &gt; 6.0 mg/L</p>
            <p className="mt-2 text-[11px] text-white/70">
              Backend automatically commands Aerator OFF to save electricity.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
            <span className="text-white/50 text-[10px] uppercase font-mono">Hysteresis Buffer</span>
            <p className="mt-1 text-sm font-bold text-[#d5f36d]">5.0 – 6.0 mg/L</p>
            <p className="mt-2 text-[11px] text-white/70">
              Preserves previous aerator state to avoid rapid on/off relay cycling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
