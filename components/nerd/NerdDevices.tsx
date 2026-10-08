'use client'

import React from 'react'
import { Cpu, Wifi, CheckCircle2, AlertTriangle, HardDrive, Radio, Layers } from 'lucide-react'
import type { SystemData } from '@/lib/api'

interface NerdDevicesProps {
  data: SystemData | null
  isLive: boolean
  lastUpdated: string
}

export function NerdDevices({ data, isLive, lastUpdated }: NerdDevicesProps) {
  const devices = [
    {
      name: 'ESP32-NODE-001',
      type: 'Microcontroller Hub',
      ip: '10.138.215.133',
      mac: '30:AE:A4:07:9F:8C',
      firmware: 'v1.0.4-rtos',
      status: isLive ? 'ONLINE' : 'OFFLINE',
      rssi: '-61 dBm',
      lastSeen: lastUpdated || 'Just now',
      sensors: ['DS18B20', 'Turbidity V1.0', 'Relay GPIO18'],
    },
  ]

  const peripherals = [
    {
      name: 'DS18B20 Waterproof Probe',
      bus: '1-Wire Protocol',
      pin: 'GPIO 4',
      status: isLive ? 'DETECTED / STREAMING' : 'OFFLINE',
      reading: data ? `${data.temperature.toFixed(2)} °C` : '--',
      rawInfo: '12-bit conversion (750ms sampling)',
    },
    {
      name: 'Gravity Analog Turbidity Sensor',
      bus: 'ADC1 (Analog to Digital)',
      pin: 'GPIO 34 (ADC1_CH6)',
      status: isLive ? 'STREAMING' : 'OFFLINE',
      reading: data ? `${data.turbidity.toFixed(3)} V` : '--',
      rawInfo: 'Operating range: 0–4.5V (Pending NTU calibration table)',
    },
    {
      name: 'MOSFET Opto-isolated Relay Driver',
      bus: 'Digital Output / PWM capable',
      pin: 'GPIO 18',
      status: data?.aerator_state === 'ON' ? 'ENGAGED (HIGH)' : 'DISENGAGED (LOW)',
      reading: data ? data.aerator_state : '--',
      rawInfo: '30A 250VAC rated / IRLZ44N gate trigger',
    },
    {
      name: 'ML Inference Microservice',
      bus: 'FastAPI / Joblib',
      pin: 'Host RAM: model/dissolved_oxygen_model.pkl',
      status: isLive ? 'ACTIVE' : 'STANDBY',
      reading: data ? `${data.dissolved_oxygen.toFixed(3)} mg/L` : '--',
      rawInfo: 'Scikit-learn Regressor; Auto Hysteresis Loop (5.0 ON / 6.0 OFF)',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-mono text-[#153b35]">Hardware & Peripherals</h2>
        <p className="text-xs text-[#788d81] font-mono">
          Edge microcontroller diagnostics, GPIO pin map, and peripheral registry
        </p>
      </div>

      {/* Main Microcontroller Card */}
      {devices.map((dev) => (
        <div
          key={dev.name}
          className="rounded-3xl border border-[#1b3d36] bg-[#112925] p-6 text-white shadow-md font-mono"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d5f36d] text-[#112925]">
                <Cpu size={22} />
              </span>
              <div>
                <h3 className="text-lg font-bold">{dev.name}</h3>
                <p className="text-xs text-[#d5f36d]">{dev.type} · ESP-WROOM-32</p>
              </div>
            </div>

            <span
              className={`rounded-full px-3.5 py-1 text-xs font-bold self-start sm:self-auto ${
                isLive
                  ? 'bg-[#1b4332] text-[#4ade80] border border-[#2d6a4f]'
                  : 'bg-[#4a1c1c] text-[#f87171] border border-[#7f1d1d]'
              }`}
            >
              ● {dev.status}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-white/50 text-[10px]">LOCAL IP</span>
              <p className="font-bold text-white mt-0.5">{dev.ip}</p>
            </div>
            <div>
              <span className="text-white/50 text-[10px]">MAC ADDRESS</span>
              <p className="font-bold text-white mt-0.5">{dev.mac}</p>
            </div>
            <div>
              <span className="text-white/50 text-[10px]">FIRMWARE</span>
              <p className="font-bold text-white mt-0.5">{dev.firmware}</p>
            </div>
            <div>
              <span className="text-white/50 text-[10px]">WIFI RSSI</span>
              <p className="font-bold text-[#4ade80] mt-0.5">{dev.rssi}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Peripheral Pin Map & Sensor Bus */}
      <div className="rounded-3xl border border-[#dce5d9] bg-white p-6 shadow-xs">
        <h3 className="text-base font-bold font-mono text-[#153b35] mb-4 flex items-center gap-2">
          <Layers size={18} className="text-[#80bd48]" />
          Connected Peripheral Subsystems & Pin Allocation
        </h3>

        <div className="space-y-4">
          {peripherals.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-[#edf1eb] bg-[#f9faf7] p-4.5 hover:bg-[#f4f7f2] transition-colors font-mono text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#153b35]">{p.name}</h4>
                  <p className="text-[11px] text-[#788d81] mt-0.5">
                    {p.bus} · <span className="font-bold text-[#153b35]">{p.pin}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#153b35] bg-white px-3 py-1 rounded-xl border border-[#dce5d9]">
                    {p.reading}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      p.status.includes('HIGH') || p.status.includes('STREAMING') || p.status.includes('ACTIVE') || p.status.includes('DETECTED')
                        ? 'bg-[#eaf6df] text-[#5c8e33]'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-[#8a9d90] border-t border-[#e2e8df] pt-2">
                Specs: {p.rawInfo}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
