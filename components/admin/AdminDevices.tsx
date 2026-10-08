'use client'

import React from 'react'
import { Cpu, Wifi, Plus, HardDrive, CheckCircle2, Clock } from 'lucide-react'

interface AdminDevicesProps {
  isLive: boolean
  lastUpdated: string
}

export function AdminDevices({ isLive, lastUpdated }: AdminDevicesProps) {
  const devices = [
    {
      id: 'dev-001',
      name: 'ESP32-001',
      assignedPond: 'Pond 01 (Kakinada)',
      ip: '10.138.215.133',
      firmware: 'v1.0.4',
      status: isLive ? 'ONLINE' : 'OFFLINE',
      isLive: true,
      lastSeen: lastUpdated || 'Just now',
    },
    {
      id: 'dev-002',
      name: 'ESP32-002',
      assignedPond: 'Unassigned Inventory',
      ip: '--',
      firmware: 'Stock v1.0.0',
      status: 'Coming soon',
      isLive: false,
      lastSeen: 'Device provisioning pending in backend DB',
    },
    {
      id: 'dev-003',
      name: 'ESP32-003',
      assignedPond: 'Unassigned Inventory',
      ip: '--',
      firmware: 'Stock v1.0.0',
      status: 'Coming soon',
      isLive: false,
      lastSeen: 'Device provisioning pending in backend DB',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">Device Fleet Management</h2>
          <p className="text-xs text-[#788d81]">
            ESP32 microcontroller inventory, firmware versions, and telemetry heartbeat status
          </p>
        </div>

        <button
          disabled
          className="rounded-full bg-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 cursor-not-allowed self-start sm:self-auto flex items-center gap-1.5"
          title="Backend device registry is not yet implemented"
        >
          <Plus size={14} />
          <span>Register ESP32 (Coming soon)</span>
        </button>
      </div>

      <div className="space-y-4">
        {devices.map((dev) => (
          <div
            key={dev.id}
            className={`rounded-3xl border p-6 transition-all ${
              dev.isLive
                ? 'border-[#cfe6bf] bg-white shadow-xs'
                : 'border-[#edf1eb] bg-white/70 opacity-80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`rounded-2xl p-3 ${
                    dev.isLive ? 'bg-[#eaf6df] text-[#5c8e33]' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Cpu size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#153b35] font-mono">{dev.name}</h3>
                  <p className="text-xs text-[#788d81]">{dev.assignedPond}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-[#788d81]">
                  IP: <strong className="text-[#153b35]">{dev.ip}</strong>
                </span>
                <span className="font-mono text-xs text-[#788d81]">
                  FW: <strong className="text-[#153b35]">{dev.firmware}</strong>
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    dev.status === 'ONLINE'
                      ? 'bg-[#eaf6df] text-[#5c8e33]'
                      : dev.status === 'OFFLINE'
                      ? 'bg-[#fff0e5] text-[#b55835]'
                      : 'bg-[#fef9e7] text-[#9c7414] border border-[#f9e79f]'
                  }`}
                >
                  {dev.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#edf1eb] flex justify-between text-[11px] text-[#8a9d90]">
              <span>Last Heartbeat: {dev.lastSeen}</span>
              <span>FastAPI Gateway: {dev.isLive ? 'http://10.138.215.133:8000' : 'Pending'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
