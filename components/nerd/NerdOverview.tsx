'use client'

import React from 'react'
import {
  Cpu,
  Radio,
  Server,
  Zap,
  Activity,
  Terminal,
  ShieldCheck,
  Clock,
  Wifi,
  Sliders,
  Power,
  RefreshCw,
} from 'lucide-react'
import { LineChart, type DataPoint } from '@/components/LineChart'
import type { SystemData } from '@/lib/api'

interface NerdOverviewProps {
  data: SystemData | null
  isLive: boolean
  lastUpdated: string
  tempHistory: DataPoint[]
  turbidityHistory: DataPoint[]
  onRefresh: () => void
}

export function NerdOverview({
  data,
  isLive,
  lastUpdated,
  tempHistory,
  turbidityHistory,
  onRefresh,
}: NerdOverviewProps) {
  const gpio18State = data?.aerator_state === 'ON' ? 'HIGH (3.3V)' : 'LOW (0V)'
  const aeratorIsOn = data?.aerator_state === 'ON'

  return (
    <div className="space-y-6">
      {/* Engineering Header Console */}
      <div className="rounded-3xl border border-[#1b3d36] bg-[#112925] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5f36d] text-[#112925] font-black">
                <Cpu size={20} />
              </span>
              <div>
                <h2 className="text-2xl font-bold font-mono tracking-tight">ESP32-NODE-001</h2>
                <p className="text-xs text-[#d5f36d] font-mono mt-0.5">
                  Firmware v1.0.4 · FreeRTOS · Xtensa dual-core 240MHz
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold ${
                  isLive
                    ? 'bg-[#1b4332] text-[#4ade80] border border-[#2d6a4f]'
                    : 'bg-[#4a1c1c] text-[#f87171] border border-[#7f1d1d]'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isLive ? 'bg-[#4ade80] animate-pulse' : 'bg-[#f87171]'
                  }`}
                />
                {isLive ? 'HEARTBEAT ACTIVE' : 'TELEMETRY DISCONNECTED'}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                WiFi RSSI: -61 dBm (Strong)
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">
                Last sync: {lastUpdated || 'Never'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-mono font-bold text-white hover:bg-white/20 transition-colors"
            >
              <RefreshCw size={13} />
              <span>Poll now</span>
            </button>
            <div className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-right">
              <p className="text-[10px] text-white/50 uppercase font-mono">FastAPI Target</p>
              <p className="text-xs font-mono font-bold text-[#d5f36d]">10.138.215.133:8000</p>
            </div>
          </div>
        </div>

        {/* Low-Level Hardware Stats Matrix */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="rounded-xl bg-black/25 p-3.5 border border-white/5">
            <span className="text-white/50 text-[10px] uppercase">Control Mode</span>
            <p className="mt-1 text-base font-bold text-[#d5f36d]">
              {data ? `${data.mode}` : '--'}
            </p>
            <span className="text-[10px] text-white/40">POST /api/aerator/mode</span>
          </div>

          <div className="rounded-xl bg-black/25 p-3.5 border border-white/5">
            <span className="text-white/50 text-[10px] uppercase">GPIO 18 (MOSFET)</span>
            <p className={`mt-1 text-base font-bold ${aeratorIsOn ? 'text-[#4ade80]' : 'text-white/50'}`}>
              {data ? gpio18State : '--'}
            </p>
            <span className="text-[10px] text-white/40">Physical Relay Actuator</span>
          </div>

          <div className="rounded-xl bg-black/25 p-3.5 border border-white/5">
            <span className="text-white/50 text-[10px] uppercase">DS18B20 1-Wire</span>
            <p className="mt-1 text-base font-bold text-white">
              {data ? `${data.temperature.toFixed(2)} °C` : '--'}
            </p>
            <span className="text-[10px] text-white/40">Pin GPIO 4 OneWire</span>
          </div>

          <div className="rounded-xl bg-black/25 p-3.5 border border-white/5">
            <span className="text-white/50 text-[10px] uppercase">ADC Pin 34</span>
            <p className="mt-1 text-base font-bold text-white">
              {data ? `${data.turbidity.toFixed(3)} V` : '--'}
            </p>
            <span className="text-[10px] text-white/40">Turbidity raw sensor voltage</span>
          </div>
        </div>
      </div>

      {/* Backend & Inference Diagnostics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ML Inference Pipeline */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf1eb]">
            <span className="text-xs font-bold text-[#153b35] flex items-center gap-2">
              <Zap size={16} className="text-[#80bd48]" />
              ML Prediction Engine
            </span>
            <span className="font-mono text-[10px] rounded-full bg-[#f1f6ed] px-2 py-0.5 text-[#5c8e33] font-bold">
              RandomForest
            </span>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-[#788d81]">Model artifact:</span>
              <span className="font-bold text-[#153b35]">dissolved_oxygen_model.pkl</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#788d81]">Predicted DO:</span>
              <span className="font-bold text-[#059669]">
                {data ? `${data.dissolved_oxygen.toFixed(3)} mg/L` : '--'}
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#788d81]">Hysteresis band:</span>
              <span className="text-[#153b35]">5.0 mg/L ON / 6.0 mg/L OFF</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-[#788d81]">Feature inputs:</span>
              <span className="text-[#153b35]">[water_temp, turbidity]</span>
            </div>
          </div>
        </div>

        {/* Backend API Service */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf1eb]">
            <span className="text-xs font-bold text-[#153b35] flex items-center gap-2">
              <Server size={16} className="text-[#2563eb]" />
              FastAPI Gateway
            </span>
            <span
              className={`font-mono text-[10px] rounded-full px-2 py-0.5 font-bold ${
                isLive ? 'bg-[#eaf6df] text-[#5c8e33]' : 'bg-[#fff0e5] text-[#b55835]'
              }`}
            >
              {isLive ? '200 OK' : 'OFFLINE'}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#788d81]">Endpoint:</span>
              <span className="font-bold text-[#153b35]">GET /api/data</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#788d81]">Aerator poll:</span>
              <span className="text-[#153b35]">GET /api/aerator/state</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#788d81]">Sensor ingestion:</span>
              <span className="text-[#153b35]">POST /api/sensors</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#788d81]">Polling rate:</span>
              <span className="text-[#153b35]">~3000 ms</span>
            </div>
          </div>
        </div>

        {/* Actuator State */}
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#edf1eb]">
            <span className="text-xs font-bold text-[#153b35] flex items-center gap-2">
              <Power size={16} className={aeratorIsOn ? 'text-[#84cc16]' : 'text-gray-400'} />
              Actuator Subsystem
            </span>
            <span
              className={`font-mono text-[10px] rounded-full px-2 py-0.5 font-bold ${
                aeratorIsOn ? 'bg-[#ecfccb] text-[#4d7c0f]' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {data ? data.aerator_state : '--'}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#788d81]">Relay signal:</span>
              <span className="font-bold text-[#153b35]">{gpio18State}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#788d81]">Driver circuit:</span>
              <span className="text-[#153b35]">IRLZ44N N-MOSFET / Opto</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#788d81]">Mode setting:</span>
              <span className="text-[#153b35]">{data?.mode || '--'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#788d81]">Safety fail-safe:</span>
              <span className="text-[#059669]">Active (Hysteresis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={tempHistory}
          title="Telemetry: Water Temperature"
          subtitle="DS18B20 digital probe reading (0.0625°C resolution)"
          unit="°C"
          lineColor="#d97706"
          fillGradientStart="rgba(217, 119, 6, 0.22)"
          fillGradientEnd="rgba(217, 119, 6, 0.01)"
          badgeText="RAW °C"
        />

        <LineChart
          data={turbidityHistory}
          title="Telemetry: Turbidity Sensor Voltage"
          subtitle="Analog voltage on ADC Pin 34 (NTU calibration pending)"
          unit="V"
          lineColor="#2563eb"
          fillGradientStart="rgba(37, 99, 235, 0.22)"
          fillGradientEnd="rgba(37, 99, 235, 0.01)"
          badgeText="ADC V"
        />
      </div>
    </div>
  )
}
