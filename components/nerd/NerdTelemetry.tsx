'use client'

import React from 'react'
import { Terminal, Database, Code, Sliders, Waves, Thermometer, Droplets } from 'lucide-react'
import { LineChart, type DataPoint } from '@/components/LineChart'
import type { SystemData } from '@/lib/api'

interface NerdTelemetryProps {
  data: SystemData | null
  isLive: boolean
  lastUpdated: string
  tempHistory: DataPoint[]
  turbidityHistory: DataPoint[]
  doHistory: DataPoint[]
}

export function NerdTelemetry({
  data,
  isLive,
  lastUpdated,
  tempHistory,
  turbidityHistory,
  doHistory,
}: NerdTelemetryProps) {
  // Approximate 12-bit ADC count based on 3.3V reference
  const turbVoltage = data?.turbidity ?? 0
  const adc12BitRaw = Math.min(4095, Math.max(0, Math.round((turbVoltage / 3.3) * 4095)))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-mono text-[#153b35]">Telemetry Signals & ADC Sampling</h2>
        <p className="text-xs text-[#788d81] font-mono">
          High-precision sensor sampling stream, raw ADC quantizations, and ML inference output
        </p>
      </div>

      {/* Raw Signal Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>DS18B20 RAW</span>
            <Thermometer size={16} className="text-[#ea580c]" />
          </div>
          <p className="text-2xl font-bold text-[#153b35]">
            {data ? data.temperature.toFixed(4) : '--'}
            <span className="text-xs font-normal text-[#788d81] ml-1">°C</span>
          </p>
          <div className="mt-3 text-[10px] text-[#8a9d90] border-t border-[#edf1eb] pt-2 flex justify-between">
            <span>Precision:</span>
            <span>0.0625°C</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>TURBIDITY SENSOR</span>
            <Droplets size={16} className="text-[#2563eb]" />
          </div>
          <p className="text-2xl font-bold text-[#153b35]">
            {data ? data.turbidity.toFixed(4) : '--'}
            <span className="text-xs font-normal text-[#788d81] ml-1">V</span>
          </p>
          <div className="mt-3 text-[10px] text-[#8a9d90] border-t border-[#edf1eb] pt-2 flex justify-between">
            <span>ADC 12-bit:</span>
            <span className="font-bold text-[#2563eb]">{adc12BitRaw} / 4095</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>PREDICTED DO</span>
            <Waves size={16} className="text-[#059669]" />
          </div>
          <p className="text-2xl font-bold text-[#153b35]">
            {data ? data.dissolved_oxygen.toFixed(4) : '--'}
            <span className="text-xs font-normal text-[#788d81] ml-1">mg/L</span>
          </p>
          <div className="mt-3 text-[10px] text-[#8a9d90] border-t border-[#edf1eb] pt-2 flex justify-between">
            <span>Model:</span>
            <span>joblib RF</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dce5d9] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#788d81] mb-2">
            <span>RELAY & MODE</span>
            <Sliders size={16} className="text-[#80bd48]" />
          </div>
          <p className="text-2xl font-bold text-[#153b35]">
            {data ? `${data.mode}` : '--'}
          </p>
          <div className="mt-3 text-[10px] text-[#8a9d90] border-t border-[#edf1eb] pt-2 flex justify-between">
            <span>Relay State:</span>
            <span className={data?.aerator_state === 'ON' ? 'font-bold text-[#4ade80]' : 'font-bold text-gray-500'}>
              {data?.aerator_state || '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Raw Ingestion Stream JSON Viewer */}
      <div className="rounded-3xl border border-[#1b3d36] bg-[#112925] p-6 text-white shadow-md font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-xs text-[#d5f36d] flex items-center gap-2">
            <Code size={16} />
            Raw Payload Inspector (GET /api/data)
          </span>
          <span className="text-[10px] text-white/50">Timestamp: {lastUpdated}</span>
        </div>
        <pre className="mt-4 overflow-x-auto text-xs text-[#a7f3d0] bg-black/40 p-4 rounded-2xl border border-white/5 leading-relaxed">
          {JSON.stringify(
            data || {
              temperature: 0.0,
              turbidity: 0.0,
              dissolved_oxygen: 0.0,
              mode: 'AUTO',
              aerator_state: 'OFF',
              _status: 'waiting for connection',
            },
            null,
            2
          )}
        </pre>
      </div>

      {/* Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={tempHistory}
          title="Digital Probe: Temperature"
          subtitle="DS18B20 OneWire live temperature feed"
          unit="°C"
          lineColor="#ea580c"
          fillGradientStart="rgba(234, 88, 12, 0.25)"
          fillGradientEnd="rgba(234, 88, 12, 0.02)"
          badgeText="°C"
        />

        <LineChart
          data={turbidityHistory}
          title="Analog ADC: Turbidity Sensor Voltage"
          subtitle="Pin 34 analog voltage (NTU calibration pending)"
          unit="V"
          lineColor="#2563eb"
          fillGradientStart="rgba(37, 99, 235, 0.25)"
          fillGradientEnd="rgba(37, 99, 235, 0.02)"
          badgeText="V"
        />
      </div>
    </div>
  )
}
