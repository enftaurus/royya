'use client'

import React from 'react'
import { Layers, Plus, CheckCircle2, AlertTriangle, Power, Thermometer, Droplets, Waves } from 'lucide-react'
import type { SystemData } from '@/lib/api'

interface AdminPondsProps {
  data: SystemData | null
  isLive: boolean
}

export function AdminPonds({ data, isLive }: AdminPondsProps) {
  const doVal = data?.dissolved_oxygen ?? 0
  const isHealthy = doVal >= 6.0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#153b35]">Pond Infrastructure</h2>
          <p className="text-xs text-[#788d81]">
            Active pond telemetry status and aerator automation across production sites
          </p>
        </div>

        <button
          disabled
          className="rounded-full bg-gray-200 px-4 py-2.5 text-xs font-bold text-gray-500 cursor-not-allowed self-start sm:self-auto flex items-center gap-1.5"
          title="Backend pond persistence is not yet implemented"
        >
          <Plus size={14} />
          <span>Provision Pond (Coming soon)</span>
        </button>
      </div>

      {/* Pond 01: Live Node */}
      <div className="rounded-3xl border border-[#cfe6bf] bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#edf1eb]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d5f36d] text-[#153b35] font-black">
              01
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#153b35]">Pond 01 (Kakinada Coastal Farm)</h3>
              <p className="text-xs text-[#788d81]">
                Node: ESP32-001 · Source: FastAPI live stream (GET /api/data)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                !isLive
                  ? 'bg-gray-100 text-gray-600'
                  : isHealthy
                  ? 'bg-[#eaf6df] text-[#5c8e33]'
                  : 'bg-[#fff0e5] text-[#b55835]'
              }`}
            >
              {!isLive ? 'Offline' : isHealthy ? 'Healthy (>6.0 mg/L)' : 'Low DO (<5.0 mg/L)'}
            </span>
            <span className="rounded-full bg-[#153b35] px-3 py-1 text-xs font-bold text-white">
              {data ? `${data.mode} MODE` : '--'}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#f4f7f2] p-4 text-xs">
            <span className="text-[#788d81] flex items-center gap-1.5">
              <Thermometer size={14} className="text-[#ea580c]" />
              Temperature
            </span>
            <p className="mt-1 text-xl font-bold text-[#153b35]">
              {data ? data.temperature.toFixed(2) : '--'} °C
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4 text-xs">
            <span className="text-[#788d81] flex items-center gap-1.5">
              <Droplets size={14} className="text-[#2563eb]" />
              Turbidity Sensor
            </span>
            <p className="mt-1 text-xl font-bold text-[#153b35]">
              {data ? data.turbidity.toFixed(2) : '--'} V
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4 text-xs">
            <span className="text-[#788d81] flex items-center gap-1.5">
              <Waves size={14} className="text-[#059669]" />
              Predicted DO
            </span>
            <p className="mt-1 text-xl font-bold text-[#153b35]">
              {data ? data.dissolved_oxygen.toFixed(2) : '--'} mg/L
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f7f2] p-4 text-xs">
            <span className="text-[#788d81] flex items-center gap-1.5">
              <Power size={14} className={data?.aerator_state === 'ON' ? 'text-[#84cc16]' : 'text-gray-400'} />
              Aerator Relay
            </span>
            <p className="mt-1 text-xl font-bold text-[#153b35]">
              {data ? data.aerator_state : '--'}
            </p>
          </div>
        </div>
      </div>

      {/* Pond 02 & 03: Coming soon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['Pond 02 (Growout B)', 'Pond 03 (Nursery A)'].map((pName, i) => (
          <div key={pName} className="rounded-3xl border border-[#edf1eb] bg-white/70 p-6 opacity-75">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf1eb]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-200 text-gray-700 font-bold text-xs">
                  0{i + 2}
                </span>
                <h4 className="font-bold text-sm text-[#153b35]">{pName}</h4>
              </div>
              <span className="rounded-full bg-[#fef9e7] px-2.5 py-0.5 text-[10px] font-bold text-[#9c7414] border border-[#f9e79f]">
                Coming soon
              </span>
            </div>
            <p className="mt-4 text-xs text-[#8a9d90]">
              Additional pond provisioning requires backend database schema support. Current FastAPI backend actively serves single-pond edge telemetry.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
